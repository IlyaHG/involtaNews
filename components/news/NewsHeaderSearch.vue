<template>
  <div class="search-wrapper">
    <input
      v-model="query"
      type="text"
      class="search-input"
      @input="$emit('search', query)"
    >
    <SearchIcon class="search-icon" />
  </div>
</template>

<script setup lang="ts">
import SearchIcon from '~/static/search.svg' 

const query = ref('')
defineEmits<{
  (e: 'search', value: string): void
}>()
</script>

<style scoped>
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 14px;
  width: 200px;
  background-color: #FFFFFF;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
}
.search-icon {
  position: absolute;
  right: 0.75rem;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  color: #888;
}
</style>
