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

export interface NewsResponseDTO {
  items: NewsItemType[]
  pagination: {
    page: number
    perPage: number
    totalItems: number
    maxPages: number
  }
  sources?: {
    [key: string]: {
      totalItems: number
      name: string
    }
  }
  error?: string
}

export type NewsViewMode = 'single' | 'double'