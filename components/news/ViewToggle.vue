<template>
  <div class="view-toggle">
    <button
      v-for="(option, index) in options"
      :key="option.value"
      :class="{ 
        'active': modelValue === option.value,
        'view-toggle__button--left': index === 0,
        'view-toggle__button--right': index === options.length - 1,
        'view-toggle__button--middle': index > 0 && index < options.length - 1
      }"
      :disabled="disabled"
      class="view-toggle__button"
      @click="emit('update:modelValue', option.value)"
    >
      <span class="view-toggle__icon">
        <slot :name="`${option.value}-label`" :option="option">
          <span>{{ option.label }}</span>
        </slot>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
interface ToggleOption<T> {
  value: T
  label: string
  icon?: string
}

interface Props<T> {
  modelValue: T
  options: readonly ToggleOption<T>[] | ToggleOption<T>[] // принимаем и readonly и обычный массив
  disabled?: boolean
}

defineProps<Props<T>>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
}>()
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