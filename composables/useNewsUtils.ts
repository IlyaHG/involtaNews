import { computed, ref } from 'vue'
import type { NewsItemType } from '~/types/news'

export function useNewsUtils(item: NewsItemType) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  const imageUrl = computed(() => {
	  if (!item.enclosure || item.enclosure.length === 0) {
	    return undefined
	  }
	  return item.enclosure[0]?.url
  })

  const hasImage = computed(() => !!imageUrl.value)
  const imageError = ref(false)

  const handleImageError = () => {
    imageError.value = true
  }

  return {
    formatDate,
    imageUrl,
    hasImage,
    imageError,
    handleImageError,
  }
}