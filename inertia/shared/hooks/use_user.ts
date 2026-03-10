import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

export function useUser() {
  return usePage<Data.SharedProps>().props.user
}
