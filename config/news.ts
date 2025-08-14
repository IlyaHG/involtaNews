import type { ToggleOption } from '~/types/toggle'
import type { NewsSource, NewsViewMode } from '~/types/news'

export const NEWS_VIEW_OPTIONS: ToggleOption<NewsViewMode>[] = [
  { value: 'single', label: '1 колонка' },
  { value: 'double', label: '2 колонки' },
]

export const NEWS_SOURCE_OPTIONS: ToggleOption<NewsSource>[] = [
  { value: 'all', label: 'Все' },
  { value: 'mos', label: 'Mos.ru' },
  { value: 'lenta', label: 'Lenta.ru' }
]