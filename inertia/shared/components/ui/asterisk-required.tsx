import { cn } from '@/lib/utils'

export function AsteriskRequired({ className }: { className?: HTMLSpanElement['className'] }) {
  return (
    <span className={cn('text-destructive font-bold', className)} aria-hidden="true">
      *
    </span>
  )
}
