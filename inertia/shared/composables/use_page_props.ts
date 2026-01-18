import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { SharedProps } from '@adonisjs/inertia/types'

export function usePageProps<T extends Record<string, any>>() {
  return computed(() => usePage<SharedProps & T>().props)
}
