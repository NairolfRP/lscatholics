import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { CheckIcon, CircleXIcon, LogOutIcon } from 'lucide-react'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Spinner } from '#/shared/components/ui/spinner'
import { useReauth } from '#/shared/hooks/use-reauth'
import { authClient } from '#/shared/integrations/auth/auth-client'
import type { Session } from '#/shared/lib/types/auth'
import type { ActionReturnType } from '#/shared/types/action.types'
import { confirmAction } from '#/shared/utils/confirm-action'
import { userListSessionsQueryKey, userlistSessionsQueryOptions } from '../queries'

export function UserSessionManagement() {
  const { withFreshSession } = useReauth('/account/settings')
  const { data: currentSession, isPending: isCurrentSessionPending } = authClient.useSession()
  const queryClient = useQueryClient()
  const {
    data: sessions,
    isLoading,
    isError: isQueryError,
    error: queryError,
    refetch,
  } = useQuery({
    ...userlistSessionsQueryOptions(withFreshSession, currentSession?.session.id),
    enabled: !isCurrentSessionPending,
  })

  const revokeMutation = useMutation({
    mutationFn: async (token: string): ActionReturnType => {
      return withFreshSession(async () => {
        const { error } = await authClient.revokeSession({ token })
        if (error) {
          return { error: true, message: error.message }
        }

        void queryClient.invalidateQueries(userListSessionsQueryKey(currentSession!.session.id))

        return { error: false }
      })
    },
  })

  if (isLoading || isCurrentSessionPending) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-45 w-full rounded-xl" />
        <Skeleton className="h-45 w-full rounded-xl" />
        <Skeleton className="h-45 w-full rounded-xl" />
      </div>
    )
  }

  if (isQueryError) {
    return (
      <>
        <Alert variant="destructive">
          <CircleXIcon />
          <AlertTitle>Échec du chargement</AlertTitle>
          <AlertDescription>
            Une erreur est survenue lors du chargement de la liste des sessions
            {import.meta.env.DEV ? (
              <>
                <br />
                <pre>{queryError.message}</pre>
              </>
            ) : null}
          </AlertDescription>
          <AlertAction>
            <Button size="xs" variant="default" onClick={() => refetch()}>
              Réessayer
            </Button>
          </AlertAction>
        </Alert>
      </>
    )
  }

  if (!sessions || sessions.length === 0) {
    return <>Aucune session active</>
  }

  return (
    <>
      {sessions.map((session) => {
        const isCurrent = session.id === currentSession?.session.id
        return (
          <SessionCard
            key={session.id}
            session={session}
            isCurrent={isCurrent}
            onRevoke={revokeMutation.mutateAsync}
            isPending={revokeMutation.isPending}
          />
        )
      })}
    </>
  )
}

type SessionCardProps = {
  session: Session['session']
  isCurrent: boolean
  isPending: boolean
  onRevoke: (token: string) => ActionReturnType
}

function SessionCard({ session, isCurrent, isPending, onRevoke }: SessionCardProps) {
  const router = useRouter()

  return (
    <>
      <Card key={session.id} className="w-full max-w-full min-w-0 overflow-hidden rounded-none">
        <CardHeader className="min-w-0 px-4 sm:px-6">
          {isCurrent && (
            <Badge className="mb-2">
              <CheckIcon />
              Actuelle
            </Badge>
          )}
          <CardTitle className="min-w-0 text-base leading-snug break-all sm:text-lg">
            {session.userAgent || 'Appareil inconnu'}
          </CardTitle>
          <CardDescription className="mt-2 min-w-0 text-sm break-all">
            Connecté le : {session.createdAt.toLocaleDateString()} - Adresse IP :{' '}
            {session.ipAddress}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <Button
            variant="link"
            className="px-0 text-destructive hover:text-destructive/80"
            disabled={isPending}
            aria-label="Déconnecter cet appareil"
            onClick={() =>
              void confirmAction(
                {
                  title: 'Confirmation',
                  description:
                    'Êtes-vous sûr de vouloir révoquer cette session ? Cette action est irréversible.',
                },
                async () => {
                  if (isCurrent) {
                    const { error } = await authClient.signOut()
                    if (error) {
                      return { error: true, message: 'Une erreur est survenue' }
                    }
                    void router.invalidate()
                    return { error: false }
                  }
                  return onRevoke(session.token)
                }
              )
            }
          >
            {isPending ? (
              <>
                <Spinner className="mr-1" /> Déconnexion...
              </>
            ) : (
              <>
                <LogOutIcon className="mr-1" /> Déconnecter
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
