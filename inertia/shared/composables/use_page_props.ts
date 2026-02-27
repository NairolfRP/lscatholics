import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { Data } from '@generated/data'

export function usePageProps<T extends Record<string, any>>() {
  return computed(() => usePage<Data.SharedProps & T>().props)
}
