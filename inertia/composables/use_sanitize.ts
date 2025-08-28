import { computed, ref } from 'vue'

export function useSanitize() {
  const DOMPurify = ref(null)
  const isReady = ref(false)

  const initializePurify = async () => {
    if (typeof window !== 'undefined' && !DOMPurify.value) {
      try {
        const { default: purify } = await import('dompurify')
        DOMPurify.value = purify
        isReady.value = true
      } catch (error) {
        console.error('Error loading DOMPurify:', error)
      }
    }
  }

  const sanitize = (content: string) => {
    if (!content) return ''
    if (!DOMPurify.value) return content
    return DOMPurify.value.sanitize(content)
  }

  return {
    initializePurify,
    sanitize,
    isReady: computed(() => isReady.value),
  }
}
