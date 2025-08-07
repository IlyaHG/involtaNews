<template>
  <li 
    class="mb-4 border p-3 rounded news__item flex flex-col w-full"
    :class="{
      'w-[520px]': viewMode === 'double'
    }"
  >
    <div class="flex-1 flex flex-row items-center justify-center gap-[30px]">
      <div 
        v-if="viewMode === 'single' && hasImage && !imageError" 
        class="flex shrink-0 w-[200px] h-[100px] overflow-hidden rounded-lg mb-4 "
      >
		<img 
			:src="imageUrl"  
			:alt="item.title"
			class="w-full h-full object-cover"
			@error="handleImageError"
		>
		</div>
		<div class="info flex flex-col gap-[20px]">
			<div class="title">
				<h2 class="text-xl font-semibold text-left  w-full">{{ item.title }}</h2>
			</div>
			<div class="description">
				<h2 class="text-xl font-semibold text-left  w-full">lorem</h2>
			</div>
		</div>

    </div>

    <div class="flex justify-between items-end pt-2">
      <p class="text-sm text-gray-500">{{item.source }}</p>
      <p class="text-sm text-gray-500">{{ formatDate(item.pubDate) }}</p>

    </div>
  </li>
</template>

<script setup lang="ts">
import type { NewsItem } from '~/types/news'

const { item, viewMode = 'single' } = defineProps<{
  item: NewsItem
  viewMode?: 'single' | 'double'
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
};

// Функция форматирования времени (HH:MM)
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

const imageUrl = computed(() => {
  if (!item.enclosure) return undefined;
  if (Array.isArray(item.enclosure)) {
    return item.enclosure[0]?.url;
  }
  return item.enclosure.url;
});

const hasImage = computed(() => !!imageUrl.value);
const imageError = ref(false);

const handleImageError = () => {
  imageError.value = true;
};
</script>
<style scoped>
.news__item {
	width: 100%;
  height: 256px;
  background: #FFFFFF;
  margin: 10px 0;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .news__item {
    width: 100% !important;
    height: auto;
    margin: 10px 0;
  }
}
</style>