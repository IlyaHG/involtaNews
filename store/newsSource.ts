import { defineStore } from 'pinia'
import { NEWS_SOURCE_OPTIONS } from '~/config/news'
import type { NewsSource } from '~/types/news'

export const useNewsSourceStore = defineStore('newsSource', {
  state: () => ({
    currentSource: 'all' as NewsSource,
    availableSourceModes: NEWS_SOURCE_OPTIONS,
  }),

  getters: {
    validSourceModes: (state) => state.availableSourceModes.map(option => option.value),
  },

  actions: {

    setCurrentSource(source: NewsSource) {
      if (this.validSourceModes.includes(source)) {
        this.currentSource = source
        if (import.meta.client) {
          localStorage.setItem('newsCurrentSource', source)
        }
      }
    },

    loadFromStorage() {
      if (import.meta.client) {
        const savedSource = localStorage.getItem('newsCurrentSource')
        if (savedSource && this.validSourceModes.includes(savedSource as NewsSource)) {
          this.currentSource = savedSource as NewsSource
        }
      }
    },

    updateAvailableSourceModes(newOptions: typeof NEWS_SOURCE_OPTIONS) {
      this.availableSourceModes = newOptions
      const newValidModes = newOptions.map(option => option.value)
      if (!newValidModes.includes(this.currentSource)) {
        this.currentSource = newOptions[0]?.value || 'all'
      }
    },
  },
})