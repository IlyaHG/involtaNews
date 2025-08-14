import { useNewsSettingsStore } from '~/store/newsSettings'

export const useNewsSettings = () => {
  const settingsStore = useNewsSettingsStore()

  const viewMode = computed({
    get: () => settingsStore.viewMode,
    set: (val) => settingsStore.setViewMode(val),
  })

  const loadSettings = () => {
    settingsStore.loadFromStorage()
  }

  return {
    viewMode,
    availableViewModes: readonly(settingsStore.availableViewModes),
    loadSettings,
  }
}