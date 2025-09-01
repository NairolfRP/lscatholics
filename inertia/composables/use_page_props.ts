import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

export function usePageProps() {
  return computed(() => usePage().props)
}
