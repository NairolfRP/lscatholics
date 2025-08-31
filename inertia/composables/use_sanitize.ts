import { computed, ref } from 'vue'
import type { DOMPurify } from 'dompurify'

export function useSanitize() {
  const service = ref<DOMPurify | null>(null)
  const isReady = ref(false)

  const initializePurify = async () => {
    if (typeof window !== 'undefined' && !service.value) {
      try {
        const { default: purify } = await import('dompurify')
        service.value = purify
        isReady.value = true
      } catch (error) {
        console.error('Error loading DOMPurify:', error)
      }
    }
  }

  const sanitize = (content: string) => {
    if (!content) return ''
    if (!service.value) return content
    return service.value.sanitize(content)
  }

  return {
    initializePurify,
    sanitize,
    isReady: computed(() => isReady.value),
  }
}
