// utils/normalizeRssItem.ts

import type { NewsItemType } from '~/types/news'
import type { RawRssItem } from '~/types/rssItem'

export function normalizeRssItem(item: RawRssItem): NewsItemType {
  const enclosure = item.enclosure
    ? [{
        url: item.enclosure.url,
        type: item.enclosure.type
      }]
    : []

  return {
    title: item.title || '',
    description: item.description || '',
    link: item.link || '',
    pubDate: item.pubDate || '',
    guid: item.guid,
    author: item.author,
    category: item.category,
    enclosure
  }
}
