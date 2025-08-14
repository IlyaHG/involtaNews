import { defineStore } from 'pinia'
import type { NewsViewMode } from '~/types/news'
import { NEWS_VIEW_OPTIONS } from '~/config/news'

export const useNewsSettingsStore = defineStore('newsSettings', {
  state: () => ({
    viewMode: 'double' as NewsViewMode,
    availableViewModes: NEWS_VIEW_OPTIONS,
  }),
  
  getters: {
    validModes: (state) => state.availableViewModes.map(option => option.value),
  },
  
  actions: {
    setViewMode(mode: NewsViewMode) {
      if (this.validModes.includes(mode)) {
        this.viewMode = mode
        if (import.meta.client) {
          localStorage.setItem('newsViewMode', mode)
        }
      }
    },
    
    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('newsViewMode')
        if (saved && this.validModes.includes(saved as NewsViewMode)) {
          this.viewMode = saved as NewsViewMode
        }
      }
    },
    
    updateAvailableViewModes(newOptions: typeof NEWS_VIEW_OPTIONS) {
      this.availableViewModes = newOptions
      const newValidModes = newOptions.map(option => option.value)
      if (!newValidModes.includes(this.viewMode)) {
        this.viewMode = newOptions[0]?.value || 'double'
      }
    },
  },
})