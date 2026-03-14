import { getErrorMessage } from 'react-error-boundary'
import { Separator } from '@/shared/components/ui/separator'
import { CardContent } from '@/shared/components/ui/card'

export function ErrorDetails({ error }: { error: unknown }) {
  return (
    <>
      <Separator />
      <CardContent className="pt-4">
        <details className="group rounded-md border bg-muted overflow-hidden">
          <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors select-none list-none flex items-center justify-between">
            Détails de l'erreur
            <span className="text-xs group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <pre className="px-3 py-2 text-xs text-muted-foreground overflow-auto max-h-40 border-t">
            {getErrorMessage(error)}
          </pre>
        </details>
      </CardContent>
    </>
  )
}
