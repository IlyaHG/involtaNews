import { useNewsSourceStore } from '~/store/newsSource'
import type { NewsSource } from '~/types/news'

interface UseNewsSourceOptions {
	onSourceChange?: (source: NewsSource) => void
}

export const useNewsSource = (options: UseNewsSourceOptions = {}) => {
	const sourceStore = useNewsSourceStore()

	const currentSource = computed({
		get: () => sourceStore.currentSource,
		set: val => {
			sourceStore.setCurrentSource(val)
			options.onSourceChange?.(val)
		},
	})

	const loadSource = () => {
		sourceStore.loadFromStorage()
	}

	return {
		currentSource,
		availableSourceModes: readonly([
			'all',
			...sourceStore.availableSourceModes,
		]),
		loadSource,
	}
}
