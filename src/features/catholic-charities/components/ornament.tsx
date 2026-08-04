import { cn } from '#/shared/lib/utils'

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)} aria-hidden>
      <span className="h-px w-16 bg-current opacity-60" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 0v16M0 8h16M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  )
}
