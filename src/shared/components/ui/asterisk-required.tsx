import { cn } from '#shared/lib/utils.ts'

export function AsteriskRequired({ className }: { className?: HTMLSpanElement['className'] }) {
  return (
    <span className={cn('font-bold text-destructive', className)} aria-hidden="true">
      *
    </span>
  )
}
