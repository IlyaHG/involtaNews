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
import NewsHeader from '~/components/news/NewsHeader.vue'
import NewsList from '~/components/news/NewsList.vue'
import { useNewsFilter } from '~/composables/useNewsFilter'
import { useNewsLoader } from '~/composables/useNewsLoader'

const { 
  currentPage, 
  searchQuery, 
  isLoading, 
  newsData, 
  loadPage, 
  handleSearch, 
  refreshNews, 
  loadFromSource 
} = useNewsLoader()

const { createFilteredComputed } = useNewsFilter()
const newsItems = computed(() => newsData.value?.items || [])
const filteredItems = createFilteredComputed(newsItems, searchQuery)
const perPage = 4
</script>
