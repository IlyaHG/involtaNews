
export interface RawRssEnclosure {
  url: string
  type: string
  length?: string
}

export interface RawRssItem {
  title?: string
  description?: string
  link?: string
  pubDate?: string
  guid?: string
  author?: string
  category?: string | string[]
  enclosure?: RawRssEnclosure
}
