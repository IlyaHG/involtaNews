<template>
  <div class="view-toggle">
    <button
      :class="{ 'active': modelValue === 'single' }"
      class="view-toggle__button view-toggle__button--left"
      @click="emit('update:modelValue', 'single')"
    >
      <span class="view-toggle__icon">
        <slot name="single-label">
          <span>1 колонка</span>
        </slot>
      </span>
    </button>
    <button
      :class="{ 'active': modelValue === 'double' }"
      class="view-toggle__button view-toggle__button--right"
      @click="emit('update:modelValue', 'double')"
    >
      <span class="view-toggle__icon">
        <slot name="double-label">
          <span>2 колонки</span>
        </slot>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'single' | 'double'
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.view-toggle {
  display: inline-flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.view-toggle__button {
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--inactive-primary-color);
}

.view-toggle__button--left {
  border-right: 1px solid var(--border-color);
}

.view-toggle__button:hover {
  background-color: var(--hover-bg-color);
}

.view-toggle__button.active {
 color: var(--primary-color);
}

.view-toggle__icon :deep(svg) {
  width: 20px;
  height: 20px;
  transition: fill 0.2s ease;
}

.view-toggle__button:not(.active) .view-toggle__icon :deep(svg) {
  fill: var(--inactive-primary-color);
}

.view-toggle__button.active .view-toggle__icon :deep(svg) {
  fill: var(--primary-color);
}
</style>