import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

export function useCurrentCharacter() {
  return usePage<Data.SharedProps>().props.user?.currentCharacter
}
