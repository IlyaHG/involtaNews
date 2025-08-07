<script setup lang="ts">
import RefreshIcon from '../../static/refresh.svg'
import NewsHeaderSearch from './NewsHeaderSearch.vue'

const emit = defineEmits(['refresh', 'search'])

const props = defineProps<{
  query: string
}>()

const query = ref(props.query)

watch(query, (val) => {
  emit('search', val)
})
</script>

<template>
  <div class="news__header">
    <h1 class="text-2xl font-bold mb-4 news__title">Список новостей</h1>

    <button class="news__header--refresh-button" @click="$emit('refresh')">
      <RefreshIcon class="refresh-icon" />
    </button>

    <div class="news__header--search">
      <NewsHeaderSearch v-model="query" />
    </div>
  </div>
</template>

<style scoped>
.news__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: var(--font-size-xl);
}

.news__title {
  color: #000;
}

.news__header--refresh-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  color: var(--primary-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.refresh-icon {
  width: 16px; /* Размер иконки можно регулировать */
  height: 16px;
}

.news__header--search {
  margin-left: auto;
}
</style>