import type { NewsSource } from '~/types/news'

export type NewsEventMap = {
  'load:all': undefined
  'load:mos': undefined
  'load:lenta': undefined
  'update:page': number
}

interface UseNewsEventsOptions {
  emit: (event: 'load:all' | 'load:mos' | 'load:lenta' | 'update:page') => void
}

export const useNewsEvents = ({ emit }: UseNewsEventsOptions) => {
  const eventMap: Record<NewsSource, keyof NewsEventMap> = {
    all: 'load:all',
    mos: 'load:mos',
    lenta: 'load:lenta'
  }

  const handleSourceChange = (source: NewsSource) => {
    const eventName = eventMap[source]
    emit(eventName)
  }

  return {
    handleSourceChange,
    eventMap: readonly(eventMap),
  }
}