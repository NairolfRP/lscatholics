import type { ErrorComponentProps } from '@tanstack/react-router'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'
import { Button } from '../button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card'
import { Separator } from '../separator'

export function DefaultErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-4">
      <div className="absolute top-0 left-0 z-0 block h-100 w-full bg-primary" />
      <div className="z-1 space-y-1 text-center">
        <h1 className="text-2xl font-bold text-primary-foreground">LS Catholics</h1>
      </div>

      <Card className="z-1 w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pb-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-xl">Une erreur est survenue</CardTitle>
            <CardDescription>
              Une erreur inattendue a été rencontrée. Vous pouvez réessayer ou rafraîchir la page.
            </CardDescription>
          </div>
        </CardHeader>

        {import.meta.env.DEV && (
          <>
            <Separator />
            <CardContent>
              <details className="group overflow-hidden rounded-md border bg-muted">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground transition-colors select-none hover:bg-muted/80 hover:text-foreground">
                  Détails de l'erreur
                  <span className="text-xs transition-transform group-open:rotate-180">▾</span>
                </summary>
                <pre className="max-h-40 overflow-auto border-t px-3 py-2 text-xs text-muted-foreground">
                  {error.stack ? error.stack : error.message ? error.message : 'N/A'}
                </pre>
              </details>
            </CardContent>
          </>
        )}

        <Separator />

        <CardFooter className="flex gap-2 pt-4">
          <Button onClick={() => reset()} className="flex-1 gap-2">
            <RotateCcw className="size-4" />
            Réessayer
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="size-4" />
            Rafraîchir
          </Button>
        </CardFooter>
      </Card>

      <p className="z-1 max-w-md text-center text-sm text-muted-foreground">
        (( Si le problème persiste, n'hésitez pas à contacter <strong>nairolf.rp</strong> sur
        Discord ou sur le{' '}
        <a
          href="https://forum-fr.gta.world/profile/11040-nairolf/"
          target="_blank"
          className="cursor-pointer font-bold text-primary underline"
        >
          forum
        </a>
        . ))
      </p>
    </div>
  )
}
