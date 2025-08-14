<script setup lang="ts">
import type { NewsItemType } from '~/types/news'
import NewsItem from '../news/NewsItem.vue'
import ViewToggle from './ViewToggle.vue'
import ToggleIconLeft from '../../static/toggle1.svg'
import ToggleIconRight from '../../static/toggle2.svg'
 import { useNewsSettings } from '~/composables/useNewsSettings'
 import { useNewsSource } from '~/composables/useNewsSource'
 import { useNewsEvents } from '~/composables/useNewsEvents'

const emit = defineEmits<{
  (e: 'load:all' | 'load:mos' | 'load:lenta'): void
  (e: 'update:page', page: number): void
}>()

defineProps<{
  items: NewsItemType[]
  isLoading: boolean
  modelValue?: number
}>()


const { handleSourceChange } = useNewsEvents({ emit })
const { viewMode, availableViewModes, loadSettings } = useNewsSettings()
const { currentSource, availableSourceModes, loadSource } = useNewsSource({
  onSourceChange: handleSourceChange
})

const initialize = () => {
  loadSettings()
  loadSource()
}


onMounted(initialize)
</script>

<template>
  <div class="news__content">
    <div class="news__content--sub-content flex justify-between items-center mb-4">
      <div class="news__source-toggle">
        <ViewToggle 
          v-model="currentSource"
          :options="availableSourceModes"
          :disabled="isLoading"
        />
      </div>

      <div class="news__content--view-toggle">
        <ViewToggle 
          v-model="viewMode"
          :options="availableViewModes"
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

.news__source-toggle :deep(.view-toggle__button) {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.news__source-toggle :deep(.view-toggle__button:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>