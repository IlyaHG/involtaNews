<template>
<div class="p-4 news">
    <NewsHeader @refresh="refreshNews" />
    
    <div v-if="isLoading" class="text-center py-4">
		<div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"/>
		<p class="mt-2 text-gray-600">Загружаем страницу {{ currentPage }}...</p>
    </div>
    
	<NewsList 
		:items="newsData?.items ?? []" 
		:page="currentPage" 
		:per-page="perPage"
		:max-pages="newsData?.maxPages || 1"
		@update:page="loadPage"
	/>

    
    <div v-if="newsData?.maxPages && newsData.maxPages > 1" class="mt-6 flex justify-center gap-2">
		<button 
        	:disabled="currentPage <= 1 || isLoading"
        	class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        	@click="loadPage(currentPage - 1)"
		>
        ← Предыдущая
		</button>

		<div class="flex gap-1">
        <button 
			v-for="pageNum in Math.min(newsData.maxPages, 5)" 
			:key="pageNum"
			:disabled="isLoading"
			:class="pageNum === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
			class="px-3 py-2 rounded disabled:opacity-50"
			@click="loadPage(pageNum)"
        >
			{{ pageNum }}
        </button>
		</div>

		<button 
        	:disabled="currentPage >= (newsData?.maxPages || 1) || isLoading"
        	class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        	@click="loadPage(currentPage + 1)"
		>
        Следующая →
		</button>
    </div>
</div>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/types/news'
import NewsHeader from '~/components/news/NewsHeader.vue'
import NewsList from '~/components/news/NewsList.vue'

const currentPage = ref(1)
const perPage = 4
const isLoading = ref(false)

const newsData = ref<{
  items: NewsItem[]
  page: number
  perPage: number
  totalLenta: number
  totalMos: number
  maxPages: number
} | null>(null)

async function loadPage(page: number) {
  if (isLoading.value) return
  
  console.log(`🔄 Загружаем страницу ${page}`)
  isLoading.value = true
  
  try {
    const response = await $fetch('/api/allnews', {
      query: {
        page,
        perPage
      }
    })
    
    console.log(`✅ Загружена страница ${page}:`, response)
    newsData.value = response
    currentPage.value = page
    
  } catch (error) {
    console.error(`❌ Ошибка загрузки страницы ${page}:`, error)
  } finally {
    isLoading.value = false
  }
}

// Функция обновления
async function refreshNews() {
  console.log('🔄 Refresh вызван, обновляем новости...')
  await loadPage(currentPage.value)
  console.log('✅ Refresh выполнен')
}

// Загружаем первую страницу при инициализации
onMounted(() => {
  loadPage(1)
})
</script>