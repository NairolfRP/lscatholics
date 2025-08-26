import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type User from '#auth/models/user'

export function useUser() {
  return computed(() => usePage().props.user as User)
}
