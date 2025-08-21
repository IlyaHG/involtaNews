import { useRoute, useRouter } from 'vue-router'
import type { NewsResponseDTO } from '~/types/news'

export function useNewsLoader(perPage = 4) {
	const route = useRoute()
	const router = useRouter()

	const currentPage = ref(Number(route.query.page) || 1)
	const searchQuery = ref(route.query.query?.toString() || '')
	const isLoading = ref(false)
	const currentSource = ref(route.query.source?.toString() || 'all')

	const { data: newsData, refresh } = useAsyncData<NewsResponseDTO>(
		'newsData',
		() =>
			$fetch('/api/news', {
				query: {
					page: currentPage.value,
					perPage,
					source: currentSource.value,
				},
			}),
		{
			watch: [
				() => route.query.page,
				() => route.query.query,
				() => route.query.source,
			],
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
			const res = await $fetch<NewsResponseDTO>('/api/news', {
				query: { page, perPage, source: currentSource.value },
			})
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
			const res = await $fetch<NewsResponseDTO>('/api/news', {
				query: { page: 1, perPage, source },
			})
			newsData.value = res
			currentPage.value = 1
			currentSource.value = source
			updateQuery({ page: '1', source })
		} finally {
			isLoading.value = false
		}
	}

	return {
		currentPage,
		searchQuery,
		isLoading,
		currentSource,
		newsData,
		refreshNews: refresh,
		loadPage,
		handleSearch,
		loadFromSource,
	}
}
