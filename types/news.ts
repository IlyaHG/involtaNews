export interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  enclosure?: NewsItemEnclosure[]
}


export interface NewsItemEnclosure {
	url: string
    type: string
}