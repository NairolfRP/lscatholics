import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { SharedProps } from '@adonisjs/inertia/types'

export function usePageProps() {
  return computed(() => usePage<SharedProps>().props)
}
