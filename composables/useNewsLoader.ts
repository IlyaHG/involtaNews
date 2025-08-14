import type { NewsResponseDTO } from '~/types/news'
import { useRoute, useRouter } from 'vue-router'

export function useNewsLoader(perPage = 4) {
  const route = useRoute()
  const router = useRouter()

  const currentPage = ref(Number(route.query.page) || 1)
  const searchQuery = ref(route.query.query?.toString() || '')
  const isLoading = ref(false)

  const { data: newsData, refresh } = useAsyncData<NewsResponseDTO>(
    'newsData',
    () => $fetch('/api/allnews', { query: { page: currentPage.value, perPage } }),
    {
      watch: [() => route.query.page, () => route.query.query],
      server: true, 
    }
  )

  function updateQuery(params: Record<string, string | undefined>) {
    if (import.meta.client) {
      router.replace({ query: { ...route.query, ...params } })
    }
  }

  async function loadPage(page: number) {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const res = await $fetch<NewsResponseDTO>('/api/allnews', { query: { page, perPage } })
      newsData.value = res
      currentPage.value = page
      updateQuery({ page: page.toString() })
    } finally {
      isLoading.value = false
    }
  }

  function handleSearch(query: string) {
    searchQuery.value = query
    updateQuery({ query: query || undefined, page: '1' })
  }

  async function loadFromSource(source: string) {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const res = await $fetch<NewsResponseDTO>('/api/rss', {
        query: { page: 1, perPage, source },
      })
      newsData.value = res
      currentPage.value = 1
      updateQuery({ page: '1', source })
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentPage,
    searchQuery,
    isLoading,
    newsData,
    refreshNews: refresh,
    loadPage,
    handleSearch,
    loadFromSource,
  }
}
