import { Spinner } from '#/shared/components/ui/spinner.tsx'

export function DashboardPendingComponent() {
  return (
    <div className="flex h-screen items-center justify-center gap-2">
      <Spinner className="size-4 text-primary" />
      <p className="font-sans text-lg font-medium">Chargement...</p>
    </div>
  )
}
