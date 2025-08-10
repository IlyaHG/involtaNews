import type { NewsItemType } from '~/types/news'

export const useNewsFilter = () => {
  const filterItems = (items: NewsItemType[], query: string): NewsItemType[] => {
    if (!query.trim()) return items
    
    const searchQuery = query.trim().toLowerCase()
    return items.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery)
    )
  }

  const createFilteredComputed = (
    items: Ref<NewsItemType[] | null>, 
    query: Ref<string>
  ) => {
    return computed(() => {
      if (!items.value) return []
      return filterItems(items.value, query.value)
    })
  }

  return {
    filterItems,
    createFilteredComputed
  }
}