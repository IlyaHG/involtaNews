import { defineStore } from 'pinia'

export const useNewsSettingsStore = defineStore('newsSettings', {
  state: () => ({
    viewMode: 'double' as 'single' | 'double',
  }),
  actions: {
    setViewMode(mode: 'single' | 'double') {
      this.viewMode = mode
      if (import.meta.client) {
        localStorage.setItem('newsViewMode', mode)
      }
    },
    loadFromStorage() {
      if (import.meta.client) {
        const saved = localStorage.getItem('newsViewMode')
        if (saved === 'single' || saved === 'double') {
          this.viewMode = saved
        }
      }
    }
  },
})
