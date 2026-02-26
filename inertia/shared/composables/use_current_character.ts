import { computed } from 'vue'
import { usePage } from '@inertiajs/vue3'
import type { Data } from '@generated/data'

export function useCurrentCharacter() {
  return computed(() => usePage<Data.SharedProps>().props.user?.currentCharacter)
}
