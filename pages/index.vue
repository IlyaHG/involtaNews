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
      :max-pages="newsData?.pagination.maxPages || 1"
      :is-loading="isLoading"
      @update:page="loadPage"
      @load:all="loadPage(1)"
      @load:mos="loadFromSource('mos')"
      @load:lenta="loadFromSource('lenta')"
    />

    <div v-if="newsData?.pagination.maxPages && newsData.pagination.maxPages > 1" class="mt-6 flex justify-center gap-2">
      <div class="flex gap-1">
        <button 
          v-for="pageNum in Math.min(newsData.pagination.maxPages, 5)" 
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
import type { NewsItemType, NewsResponseDTO } from '~/types/news'
import NewsHeader from '~/components/news/NewsHeader.vue'
import NewsList from '~/components/news/NewsList.vue'
import { useRoute, useRouter } from 'vue-router'
import { useAsyncData } from '#app'

const route = useRoute()
const router = useRouter()
const { createFilteredComputed } = useNewsFilter()

const searchQuery = ref(route.query.query?.toString() || '')
const currentPage = ref(Number(route.query.page) || 1)
const perPage = 4
const isLoading = ref(false)

const newsItems = computed(() => newsData.value?.items || [])
const filteredItems = createFilteredComputed(newsItems, searchQuery)

const { data: newsData, refresh } = await useAsyncData<NewsResponseDTO>(
  'newsData',
  () => $fetch('/api/allnews', {
    query: { page: currentPage.value, perPage },
  }),
  {
    watch: [() => route.query.page, () => route.query.query], 
    server: true, 
  }
)

function handleSearch(query: string) {
  searchQuery.value = query
  router.replace({
    query: {
      ...route.query,
      query: query || undefined,
      page: '1', 
    },
  })
}

async function loadPage(page: number) {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await $fetch<NewsResponseDTO>('/api/allnews', {
      query: { page, perPage },
    })
    newsData.value = response
    currentPage.value = page
    router.replace({
      query: {
        ...route.query,
        page: page.toString(),
      },
    })
  } finally {
    isLoading.value = false
  }
}

async function refreshNews() {
  await refresh()
}

async function loadFromSource(source: string) {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const response = await $fetch<NewsResponseDTO>('/api/rss', {
      query: { page: 1, perPage, source },
    })
    newsData.value = response
    currentPage.value = 1
    router.replace({
      query: {
        ...route.query,
        page: '1',
        source,
      },
    })
  } finally {
    isLoading.value = false
  }
}
</script>