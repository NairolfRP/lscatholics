import { cn } from '@/lib/utils'

export function MapFallback({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 bg-muted/30', className)}>
      <svg
        className="animate-spin h-8 w-8 text-catholic-gold"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-sm text-muted-foreground">Chargement de la carte…</p>
    </div>
  )
}
