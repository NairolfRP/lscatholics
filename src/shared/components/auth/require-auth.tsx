import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { useState } from 'react'
import { LogInIcon, ShieldCheckIcon } from 'lucide-react'
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
import { cn } from '#shared/lib/utils.ts'

export function RequireAuth({
  children,
  fallback,
  className,
}: PropsWithChildren<{ fallback?: ReactNode }> & Omit<ComponentProps<typeof Card>, 'children'>) {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return fallback
  }

  if (!session?.user) {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardHeader className="flex flex-col items-center text-center">
          <span className="mb-1 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheckIcon className="size-6" />
          </span>
          <CardTitle className="text-lg font-bold">Connexion requise</CardTitle>
          <CardDescription className="mx-auto max-w-md">
            Vous devez être connecté pour accéder à cette fonctionnalité.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <SignInButton />
          <p className="text-xs text-muted-foreground">
            (( La connexion utilise votre compte GTA World, aucun mot de passe n'est nécessaire. ))
          </p>
        </CardContent>
      </Card>
    )
  }

  return children
}

function SignInButton() {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      size="lg"
      variant="secondary"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        void authClient.signIn.oauth2(
          {
            providerId: 'gtaw',
            callbackURL: window.location.href,
            errorCallbackURL: window.location.href,
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
      {loading ? 'Connexion...' : 'Se connecter'}
    </Button>
  )
}
