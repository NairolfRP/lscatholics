import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

export function usePageProps<T extends Record<string, any>>() {
  return usePage<Data.SharedProps & T>().props
}
