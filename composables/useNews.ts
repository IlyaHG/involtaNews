import { useNewsSettings } from './useNewsSettings'
import { useNewsSource } from './useNewsSource'
import { useNewsEvents } from './useNewsEvents'
import type { NewsEventMap } from './useNewsEvents'


interface UseNewsOptions {
  emit: <K extends keyof NewsEventMap>(
    event: K,
    ...args: NewsEventMap[K] extends undefined  ? [] : [NewsEventMap[K]]
  ) => void
}

export const useNews = ({ emit }: UseNewsOptions) => {
  const { handleSourceChange } = useNewsEvents({ emit })
  
  const newsSettings = useNewsSettings()
  
  const newsSource = useNewsSource({
    onSourceChange: handleSourceChange
  })

  const initialize = () => {
    newsSettings.loadSettings()
    newsSource.loadSource()
  }

  return {
    viewMode: newsSettings.viewMode,
    availableViewModes: newsSettings.availableViewModes,
    
    currentSource: newsSource.currentSource,
    availableSourceModes: newsSource.availableSourceModes,
    
    initialize,
  }
}