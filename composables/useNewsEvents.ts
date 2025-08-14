import type { NewsSource } from '~/types/news'

export type NewsEventMap = {
  'load:all': undefined
  'load:mos': undefined
  'load:lenta': undefined
  'update:page': number
}

type EmitFn = <K extends keyof NewsEventMap>(
  event: K,
  payload: NewsEventMap[K]
) => void

interface UseNewsEventsOptions {
  emit: EmitFn
}

export const useNewsEvents = ({ emit }: UseNewsEventsOptions) => {
  const eventMap: Record<NewsSource, 'load:all' | 'load:mos' | 'load:lenta'> = {
    all: 'load:all',
    mos: 'load:mos',
    lenta: 'load:lenta'
  }

  const handleSourceChange = (source: NewsSource) => {
    const eventName = eventMap[source]
    emit(eventName, undefined as NewsEventMap[typeof eventName])
  }

  return {
    handleSourceChange,
    eventMap: readonly(eventMap),
  }
}
