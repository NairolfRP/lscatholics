import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { LogInIcon, ShieldCheckIcon } from 'lucide-react'
import { getSessionFn } from '#/server-fn/auth.functions'
import { pageMetadata } from '#/utils/seo'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Spinner } from '#shared/components/ui/spinner.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { authClient } from '#shared/integrations/auth/auth-client.ts'

export const Route = createFileRoute('/_app/sign-in')({
  validateSearch: (search: Record<string, unknown>) => {
    const redirectTo = search.redirectTo

    return {
      redirectTo:
        typeof redirectTo === 'string' &&
        (redirectTo === '/dashboard' || redirectTo.startsWith('/dashboard/'))
          ? redirectTo
          : '/dashboard',
    }
  },
  beforeLoad: async ({ search }) => {
    const session = await getSessionFn()
    if (session) {
      throw redirect({ href: search.redirectTo, replace: true })
    }
  },
  head: () => ({
    meta: pageMetadata('Connexion'),
  }),
  component: SignInPage,
})

function SignInPage() {
  const [loading, setLoading] = useState(false)
  const { redirectTo } = Route.useSearch()

  return (
    <main className="mx-auto flex min-h-[60svh] w-full max-w-xl items-center justify-center px-4 py-16">
      <Card className="w-full border-dashed">
        <CardHeader className="flex flex-col items-center text-center">
          <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheckIcon className="size-6" />
          </span>
          <CardTitle className="text-lg font-bold">Connexion requise</CardTitle>
          <CardDescription className="mx-auto max-w-md">
            Connectez-vous avec votre compte GTA World pour accéder au tableau de bord.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setLoading(true)
              void authClient.signIn.social(
                {
                  provider: 'gtaw',
                  callbackURL: redirectTo,
                  errorCallbackURL: `/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`,
                },
                {
                  onError: (ctx) => {
                    toast.error(ctx.error.message)
                    setLoading(false)
                  },
                }
              )
            }}
          >
            {loading ? <Spinner data-icon="inline-start" /> : <LogInIcon />}
            {loading ? 'Connexion...' : 'Se connecter avec GTA World'}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            (( La connexion utilise votre compte GTA World. Aucun mot de passe n'est nécessaire. ))
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
