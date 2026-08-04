import { cn } from '#/shared/lib/utils'

export function MapFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-80 w-full flex-col items-center justify-center gap-4 bg-muted/40',
        className
      )}
      role="status"
      aria-label="Chargement de la carte"
    >
      <span className="size-10 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      <p className="text-sm text-muted-foreground">Chargement de la carte…</p>
    </div>
  )
}

export default MapFallback
