<script setup lang="ts">
import type { NewsItemType } from '~/types/news'
import  NewsItem  from '../news/NewsItem.vue'

import ViewToggle from './ViewToggle.vue'
import ToggleIconLeft from '../../static/toggle1.svg'
import ToggleIconRight from '../../static/toggle2.svg'
import { useNewsSettingsStore } from '~/store/newsSettings';

const emit = defineEmits<{
  (e: 'load:all' | 'load:mos' | 'load:lenta' | 'update:page'): void
}>()

defineProps<{
	items: NewsItemType[]
  isLoading: boolean
  modelValue?: number
}>()


const settingsStore = useNewsSettingsStore()

onMounted(() => {
  settingsStore.loadFromStorage()
})

const viewMode = computed({
  get: () => settingsStore.viewMode,
  set: (val) => settingsStore.setViewMode(val),
})

</script>

<template>
  <div class="news__content">
	<div class="news__content--sub-content flex justify-between items-center mb-4">
  <div class="flex gap-2">
	<button
	  class="px-4 py-2 text-black disabled:opacity-50"
	  :disabled="isLoading"
	  @click="emit('load:all')"
	>
	  Все
	</button>
	<button
	  class="px-4 py-2 text-black disabled:opacity-50"
	  :disabled="isLoading"
	  @click="emit('load:mos')"
	>
	  Mos.ru
	</button>
	<button
	  class="px-4 py-2 text-black rounded disabled:opacity-50"
	  :disabled="isLoading"
	  @click="emit('load:lenta')"
	>
	  Lenta.ru
	</button>
  </div>

  <div class="news__content--view-toggle">
    <ViewToggle 
      v-model="viewMode"
    >
      <template #single-label>
        <span><ToggleIconLeft /></span>
      </template>
      <template #double-label>
        <span><ToggleIconRight /></span>
      </template>
    </ViewToggle>
  </div>
</div>

    
    <div v-if="!items?.length">Загрузка...</div>

    <ul v-else class="news__content--list" :class="viewMode">
      <NewsItem 
        v-for="item in items" 
        :key="item.link || item.title" 
        :item="item" 
      />
    </ul>
  </div>
</template>

<style scoped>
.news__content--list {
  display: grid;
  gap: 1.5rem;
}

.news__content--list.single {
  grid-template-columns: 1fr;
}

.news__content--list.double {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 768px) {
  .news__content--list.double {
    grid-template-columns: 1fr;
  }
}

</style>
