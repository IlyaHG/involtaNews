import { defineEventHandler, getQuery } from 'h3'
import { parseStringPromise } from 'xml2js'
import fetch from 'node-fetch'
import type { NewsItemType, NewsResponseDTO } from '~/types/news'

interface RSSSource {
  url: string
  name: string
}

const rssSources: Record<string, RSSSource> = {
  lenta: { url: 'https://lenta.ru/rss', name: 'lenta' },
  mos: { url: 'https://www.mos.ru/rss', name: 'mos' },
}

async function fetchRSSFeed({ url, name }: RSSSource): Promise<NewsItemType[]> {
  try {
    const res = await fetch(url)
    const xml = await res.text()
    const json = await parseStringPromise(xml, {
      explicitArray: false,
      mergeAttrs: true,
    })

    const rawItems = json.rss.channel.item
    const items = Array.isArray(rawItems) ? rawItems : [rawItems]
    
    const normalizedItems: NewsItemType[] = items.map(item => ({
      title: item.title || 'Без названия',
      description: item.description || '',
      link: item.link || item.guid || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: name,
      enclosure: item.enclosure ? (Array.isArray(item.enclosure) ? item.enclosure : [item.enclosure]) : null,
    }))

    normalizedItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    return normalizedItems
  } catch (error) {
    console.error(`Error fetching RSS feed from ${name}:`, error)
    return []
  }
}

export default defineEventHandler(async (event): Promise<NewsResponseDTO> => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 4
  const source = query.source?.toString()

  if (!source || !rssSources[source]) {
    return {
      items: [],
      pagination: {
        page,
        perPage,
        totalItems: 0,
        maxPages: 0,
      },
      error: 'Invalid or missing source parameter',
    }
  }

  try {
    const items = await fetchRSSFeed(rssSources[source])
    const startIndex = (page - 1) * perPage
    const paginatedItems = items.slice(startIndex, startIndex + perPage)

    return {
      items: paginatedItems,
      pagination: {
        page,
        perPage,
        totalItems: items.length,
        maxPages: Math.ceil(items.length / perPage),
      },
      sources: {
        [source]: {
          name: source,
          totalItems: items.length,
        },
      },
    }
  } catch (error) {
    return {
      items: [],
      pagination: {
        page,
        perPage,
        totalItems: 0,
        maxPages: 0,
      },
      error: error.message || 'Неизвестная ошибка',
    }
  }
})