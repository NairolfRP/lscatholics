import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'

export function useErrors() {
  return computed(() => usePage().props.errors || {})
}
