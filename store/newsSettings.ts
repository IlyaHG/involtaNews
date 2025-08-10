import { defineStore } from 'pinia'
import type { NewsViewMode } from '~/types/news'

export const useNewsSettingsStore = defineStore('newsSettings', {
  state: () => ({
    viewMode: 'double' as NewsViewMode,
  }),
  actions: {
    setViewMode(mode: NewsViewMode) {
      const validModes: NewsViewMode[] = ['single', 'double']
      if (validModes.includes(mode)) {
        this.viewMode = mode
        if (import.meta.client) {
          localStorage.setItem('newsViewMode', mode)
        }
      }
    },
    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('newsViewMode')
        const validModes: NewsViewMode[] = ['single', 'double']
        if (saved && validModes.includes(saved as NewsViewMode)) {
          this.viewMode = saved as NewsViewMode
        }
      }
    },
  },
})