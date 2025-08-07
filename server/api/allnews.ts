import { defineEventHandler, getQuery } from 'h3'
import { parseStringPromise } from 'xml2js'
import fetch from 'node-fetch'

async function fetchRSSFeed(url: string, sourceName: string) {

	try {
		const res = await fetch(url)
		const xml = await res.text()
		
		const json = await parseStringPromise(xml, {
			explicitArray: false,
			mergeAttrs: true,
    })

    const rawItems = json.rss.channel.item

    const items = Array.isArray(rawItems) ? rawItems : [rawItems]
    const normalizedItems = items.map(item => ({
		title: item.title || 'Без названия',
		description: item.description || '',
		link: item.link || item.guid || '',
		pubDate: item.pubDate || new Date().toISOString(),
		source: sourceName,
		enclosure: item.enclosure || null
    }))

    normalizedItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    
    return normalizedItems

  } catch (error) {
    return []
  }
}

export default defineEventHandler(async (event) => {
  
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 4
  const itemsPerSource = Math.floor(perPage / 2) 


  try {
    const [lentaNews, mosNews] = await Promise.all([
		fetchRSSFeed('https://lenta.ru/rss', 'lenta'),
		fetchRSSFeed('https://www.mos.ru/rss', 'mos')
    ])


    const startIndex = (page - 1) * itemsPerSource
    const lentaSlice = lentaNews.slice(startIndex, startIndex + itemsPerSource)
    const mosSlice = mosNews.slice(startIndex, startIndex + itemsPerSource)


    const result = []
    const maxLength = Math.max(lentaSlice.length, mosSlice.length)
    
    for (let i = 0; i < maxLength; i++) {
		if (lentaSlice[i]) result.push(lentaSlice[i])
		if (mosSlice[i]) result.push(mosSlice[i])
    }


    const response = {
	  items: result,
	  page,
	  perPage,
	  totalLenta: lentaNews.length,
	  totalMos: mosNews.length,
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