// types/news.ts
export interface NewsItemType {
  title: string
  description: string
  link: string
  pubDate: string
  guid?: string
  author?: string
  source?: string
  category?: string | string[]
  enclosure?: Array<{
    url: string
    type: string
  }>
}
