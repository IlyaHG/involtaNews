<script setup lang="ts">
import type { NewsItem } from '~/types/news'
import ViewToggle from './ViewToggle.vue'
import ToggleIconLeft from '../../static/toggle1.svg'
import ToggleIconRight from '../../static/toggle2.svg'

const props = defineProps<{
  items: NewsItem[]
  page: number
  perPage: number
  maxPages: number
}>()

const emit = defineEmits(['update:page'])
const viewMode = ref<'single' | 'double'>('double')
</script>

<template>
  <div class="news__content">
    <ViewToggle 
      v-model="viewMode" 
      class="news__content--view-toggle"
    >
      <template #single-label>
        <span><ToggleIconLeft /></span>
      </template>
      <template #double-label>
        <span><ToggleIconRight /></span>
      </template>
    </ViewToggle>

    <div v-if="!items?.length">Загрузка...</div>

    <ul v-else class="news__content--list" :class="viewMode">
      <NewsItem 
        v-for="item in items" 
        :key="item.link || item.title" 
        :item="item" 
        :view-mode="viewMode"
      />
    </ul>

    <div class="mt-6 flex gap-2 items-center">
      <button
        :disabled="page === 1"
        @click="emit('update:page', page - 1)"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Назад
      </button>

      <button
        :disabled="page >= maxPages"
        @click="emit('update:page', page + 1)"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Вперёд
      </button>

      <span class="ml-2 text-sm text-gray-600">
        Страница {{ page }} из {{ maxPages }}
      </span>
    </div>
  </div>
</template>
