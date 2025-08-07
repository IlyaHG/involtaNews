import { defineEventHandler, getQuery } from 'h3'
import { parseStringPromise } from 'xml2js'
import fetch from 'node-fetch'

// Функция для получения и парсинга RSS
async function fetchRSSFeed(url: string, sourceName: string) {
  try {
    console.log(`🔄 Загружаем RSS: ${url}`)
    
    const res = await fetch(url)
    const xml = await res.text()

    const json = await parseStringPromise(xml, {
      explicitArray: false,
      mergeAttrs: true,
    })

    const rawItems = json.rss.channel.item
    console.log(`📰 Найдено новостей в ${sourceName}: ${Array.isArray(rawItems) ? rawItems.length : 1}`)

    // Нормализуем данные и добавляем источник
    const items = Array.isArray(rawItems) ? rawItems : [rawItems]
    const normalizedItems = items.map(item => ({
      title: item.title || 'Без названия',
      description: item.description || '',
      link: item.link || item.guid || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: sourceName,
      enclosure: item.enclosure || null
    }))

    // Сортируем по дате (новые сверху)
    normalizedItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    
    console.log(`✅ Обработано новостей ${sourceName}: ${normalizedItems.length}`)
    return normalizedItems

  } catch (error) {
    console.error(`❌ Ошибка загрузки ${sourceName}:`, error.message)
    return []
  }
}

export default defineEventHandler(async (event) => {
  console.log('=== 📰 ALLNEWS API CALLED ===')
  
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 4
  const itemsPerSource = Math.floor(perPage / 2) // По 2 из каждого источника

  console.log('🔍 Параметры:', { page, perPage, itemsPerSource })

  try {
    // Загружаем RSS параллельно
    console.log('🚀 Запускаем параллельную загрузку RSS...')
    const [lentaNews, mosNews] = await Promise.all([
      fetchRSSFeed('https://lenta.ru/rss', 'lenta'),
      fetchRSSFeed('https://www.mos.ru/rss', 'mos')
    ])

    console.log(`📊 Результаты загрузки: Lenta=${lentaNews.length}, MOS=${mosNews.length}`)

    // Применяем пагинацию к каждому источнику
    const startIndex = (page - 1) * itemsPerSource
    const lentaSlice = lentaNews.slice(startIndex, startIndex + itemsPerSource)
    const mosSlice = mosNews.slice(startIndex, startIndex + itemsPerSource)

    console.log(`🔍 Пагинация: startIndex=${startIndex}, запрошено по ${itemsPerSource} из каждого источника`)
    console.log(`📋 Доступно для пагинации: Lenta=${lentaNews.length}, MOS=${mosNews.length}`)
    console.log(`📄 Взяли для страницы ${page}: Lenta[${startIndex}:${startIndex + itemsPerSource}], MOS[${startIndex}:${startIndex + itemsPerSource}]`)

    console.log(`📄 Страница ${page}: взяли Lenta=${lentaSlice.length}, MOS=${mosSlice.length}`)

    // Чередуем новости: Лента -> МОС -> Лента -> МОС
    const result = []
    const maxLength = Math.max(lentaSlice.length, mosSlice.length)
    
    for (let i = 0; i < maxLength; i++) {
      if (lentaSlice[i]) result.push(lentaSlice[i])
      if (mosSlice[i]) result.push(mosSlice[i])
    }

    console.log(`✅ Возвращаем ${result.length} новостей для страницы ${page}`)
    console.log(`📊 Расчет страниц: maxPages = Math.ceil(Math.max(${lentaNews.length}, ${mosNews.length}) / ${itemsPerSource}) = ${Math.ceil(Math.max(lentaNews.length, mosNews.length) / itemsPerSource)}`)

    const response = {
      items: result,
      page,
      perPage,
      totalLenta: lentaNews.length,
      totalMos: mosNews.length,
      // Исправляем расчет максимальных страниц - берем максимум, а не минимум
      maxPages: Math.ceil(Math.max(lentaNews.length, mosNews.length) / itemsPerSource),
      debug: {
        startIndex,
        itemsPerSource,
        lentaSliceLength: lentaSlice.length,
        mosSliceLength: mosSlice.length,
        resultLength: result.length,
        canLoadMore: (startIndex + itemsPerSource < Math.max(lentaNews.length, mosNews.length)),
        maxPagesCalc: `Math.ceil(Math.max(${lentaNews.length}, ${mosNews.length}) / ${itemsPerSource}) = ${Math.ceil(Math.max(lentaNews.length, mosNews.length) / itemsPerSource)}`
      }
    }

    return response

  } catch (error) {
    console.error('❌ Критическая ошибка API:', error)
    
    return {
      items: [],
      page,
      perPage,
      totalLenta: 0,
      totalMos: 0,
      error: error.message || 'Неизвестная ошибка'
    }
  }
})