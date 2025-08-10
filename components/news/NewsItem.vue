<template>
  <li 
    class="news__item border p-3 rounded flex flex-col transition-all duration-300"
    :class="viewMode"
  >
    <div class="flex flex-1 flex-row items-center gap-[30px]">
      <div 
        v-if="viewMode === 'single' && hasImage && !imageError" 
        class="shrink-0 w-[200px] h-[100px] overflow-hidden rounded-lg"
      >
        <img 
          :src="imageUrl"  
          :alt="item.title"
          class="w-full h-full object-cover"
          @error="handleImageError"
        >
      </div>

      <div class="info flex flex-col gap-[20px] flex-1">
        <div class="title">
          <h2 class="text-xl font-semibold text-left">{{ item.title }}</h2>
        </div>
        <div class="description">
          <p class="text-gray-700 text-sm">lorem</p>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-end pt-2 mt-auto text-sm text-gray-500">
      <p>{{ item.source }}</p>
      <p>{{ formatDate(item.pubDate) }}</p>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { NewsItemType, NewsViewMode } from '~/types/news'
import { useNewsSettingsStore } from '~/store/newsSettings'
import { useNewsUtils } from '~/composables/useNewsUtils'

const store = useNewsSettingsStore()
const viewMode = computed(() => store.viewMode as NewsViewMode)

const { item } = defineProps<{
  item: NewsItemType
}>()

const { formatDate, imageUrl, hasImage, imageError, handleImageError } = useNewsUtils(item)
</script>

<style scoped>
.news__item {
  width: 100%;
  min-height: 200px;
  background: #FFFFFF;
  margin: 10px 0;
}

.news__item.single {
  width: 100%;
  height: 256px;
}

.news__item.double {
  width: 100%;
  height: auto;
}

.news__item.compact {
  width: 100%;
  min-height: 150px;
  padding: 1.5rem;
}

.news__item.grid {
  width: 100%;
  min-height: 300px;
  padding: 1rem;
}

@media (max-width: 768px) {
  .news__item {
    width: 100%;
    height: auto; 
  }
}
</style>