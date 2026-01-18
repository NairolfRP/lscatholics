import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { SharedProps } from '@adonisjs/inertia/types'

export function useUser() {
  return computed(() => usePage().props.user as SharedProps['user'])
}
