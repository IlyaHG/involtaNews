<template>
  <div class="p-4 news">
    <NewsHeader :query="searchQuery" @refresh="refreshNews" @search="handleSearch" />

    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
      <p class="mt-2 text-gray-600">Загружаем страницу {{ currentPage }}...</p>
    </div>

	<NewsList 
	  :items="filteredItems" 
	  :page="currentPage" 
	  :per-page="perPage"
	  :max-pages="newsData?.maxPages || 1"
	  :is-loading="isLoading"
	  @update:page="loadPage"
	  @load:all="loadPage(1)"
	  @load:mos="loadFromMos"
	  @load:lenta="loadFromLenta"
	/>


    <div v-if="newsData?.maxPages && newsData.maxPages > 1" class="mt-6 flex justify-center gap-2">
      <div class="flex gap-1">
        <button 
          v-for="pageNum in Math.min(newsData.maxPages, 5)" 
          :key="pageNum"
          :disabled="isLoading"
          :class="pageNum === currentPage ? 'text-blue' : 'text-black'"
          class="px-3 py-2"
          @click="loadPage(pageNum)"
        >
          {{ pageNum }}
        </button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import type { NewsItemType } from '~/types/news'
import NewsHeader from '~/components/news/NewsHeader.vue'
import NewsList from '~/components/news/NewsList.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const searchQuery = ref(route.query.query?.toString() || '')

const filteredItems = computed(() => {
  if (!newsData.value) return []
  if (!searchQuery.value.trim()) return newsData.value.items

  const q = searchQuery.value.trim().toLowerCase()
  return newsData.value.items.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q)
  )
})

function handleSearch(query: string) {
  searchQuery.value = query

  router.replace({
    query: {
      ...route.query,
      query: query || undefined,
    }
  })
}


const currentPage = ref(1)
const perPage = 4
const isLoading = ref(false)

const newsData = ref<{
  items: NewsItemType[]
  page: number
  perPage: number
  totalLenta: number
  totalMos: number
  maxPages: number
} | null>(null)

async function loadPage(page: number) {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await $fetch('/api/allnews', {
      query: { page, perPage }
    })

    newsData.value = response
    currentPage.value = page
  }  finally {
    isLoading.value = false
  }
}

async function refreshNews() {
  await loadPage(currentPage.value)
}

async function loadFromMos() {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await $fetch<NewsItemType[]>('/api/news')
    newsData.value = {
      items: response,
      page: 1,
      perPage,
      totalLenta: 0,
      totalMos: response.length,
      maxPages: Math.ceil(response.length / perPage)
    }
    currentPage.value = 1
  } finally {
    isLoading.value = false
  }
}

async function loadFromLenta() {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await $fetch<NewsItemType[]>('/api/lenta')
    newsData.value = {
      items: response,
      page: 1,
      perPage,
      totalLenta: response.length,
      totalMos: 0,
      maxPages: Math.ceil(response.length / perPage)
    }
    currentPage.value = 1 
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPage(1)
})
</script>
