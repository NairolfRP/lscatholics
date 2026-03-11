'use client'
import { Button } from '@/shared/components/ui/button'
import { FallbackProps, getErrorMessage } from 'react-error-boundary'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Separator } from '@/shared/components/ui/separator'

type Props = FallbackProps

export function ErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 p-4">
      <div className="absolute top-0 left-0 block bg-catholic-purple h-100 w-full z-0" />
      <div className="text-center space-y-1 z-1">
        <p className="text-sm font-medium tracking-widest text-catholic-gold uppercase">
          Archidiocèse de Los Santos
        </p>
        <h1 className="text-2xl font-serif font-bold text-primary">LS Catholics</h1>
      </div>

      <Card className="w-full max-w-md shadow-lg z-1">
        <CardHeader className="flex flex-col items-center text-center gap-4 pb-4">
          <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center">
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
        )}

        <Separator />

        <CardFooter className="flex gap-2 pt-4">
          <Button onClick={resetErrorBoundary} className="flex-1 gap-2">
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

      <p className="text-sm text-muted-foreground text-center max-w-md z-1">
        (( Si le problème persiste, n'hésitez pas à contacter <strong>nairolf.rp</strong> sur
        Discord ou sur le{' '}
        <a
          href="https://forum-fr.gta.world/profile/11040-nairolf/"
          target="_blank"
          className="text-primary underline cursor-pointer font-bold"
        >
          forum
        </a>
        . ))
      </p>
    </div>
  )
}
