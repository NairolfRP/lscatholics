import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  CheckIcon,
  CircleXIcon,
  LaptopIcon,
  LogOutIcon,
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
} from 'lucide-react'
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
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '#/shared/components/ui/empty'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Spinner } from '#/shared/components/ui/spinner'
import { toast } from '#/shared/components/ui/toast'
import { useReauth } from '#/shared/hooks/use-reauth'
import { authClient } from '#/shared/integrations/auth/auth-client'
import type { Session } from '#/shared/lib/types/auth'
import type { ActionReturnType } from '#/shared/types/action.types'
import { confirmAction } from '#/shared/utils/confirm-action'
import { userListSessionsQueryKey, userlistSessionsQueryOptions } from '../queries'
import { parseUserAgent } from '../utils/parse-user-agent'

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

  const revokeOthersMutation = useMutation({
    mutationFn: async (): ActionReturnType => {
      return withFreshSession(async () => {
        const others = (sessions ?? []).filter((s) => s.id !== currentSession?.session.id)
        for (const s of others) {
          const { error } = await authClient.revokeSession({ token: s.token })
          if (error) {
            return { error: true, message: error.message }
          }
        }
        void queryClient.invalidateQueries(userListSessionsQueryKey(currentSession!.session.id))
        toast.success('Les autres sessions ont été déconnectées')
        return { error: false }
      })
    },
  })

  if (isLoading || isCurrentSessionPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
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
    return (
      <Empty className="border">
        <EmptyMedia variant="icon">
          <MonitorIcon />
        </EmptyMedia>
        <EmptyTitle>Aucune session active</EmptyTitle>
        <EmptyDescription>Vos sessions actives apparaîtront ici.</EmptyDescription>
      </Empty>
    )
  }

  const current = sessions.find((s) => s.id === currentSession?.session.id)
  const others = sessions.filter((s) => s.id !== currentSession?.session.id)

  return (
    <div className="space-y-4">
      {current ? (
        <SessionCard
          session={current}
          isCurrent
          onRevoke={revokeMutation.mutateAsync}
          isPending={revokeMutation.isPending}
        />
      ) : null}

      {others.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Autres appareils ({others.length})
            </p>
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer"
              disabled={revokeOthersMutation.isPending}
              onClick={() =>
                void confirmAction(
                  {
                    title: 'Déconnecter tous les autres appareils ?',
                    description:
                      'Toutes les sessions autres que celle-ci seront révoquées. Cette action est irréversible.',
                    confirmLabel: 'Tout déconnecter',
                    confirmVariant: 'destructive',
                  },
                  revokeOthersMutation.mutateAsync
                )
              }
            >
              {revokeOthersMutation.isPending ? (
                <>
                  <Spinner className="mr-1" /> Déconnexion...
                </>
              ) : (
                <>
                  <LogOutIcon className="mr-1" /> Tout déconnecter
                </>
              )}
            </Button>
          </div>
          <div className="space-y-3">
            {others.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isCurrent={false}
                onRevoke={revokeMutation.mutateAsync}
                isPending={revokeMutation.isPending}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
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
  const parsed = parseUserAgent(session.userAgent)
  const DeviceIcon =
    parsed.device === 'mobile'
      ? SmartphoneIcon
      : parsed.device === 'tablet'
        ? TabletIcon
        : parsed.device === 'desktop'
          ? LaptopIcon
          : MonitorIcon

  return (
    <Card
      className={
        isCurrent
          ? 'w-full max-w-full min-w-0 overflow-hidden rounded-xl border-primary/40 bg-primary/5'
          : 'w-full max-w-full min-w-0 overflow-hidden rounded-xl'
      }
    >
      <CardHeader className="min-w-0 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <DeviceIcon className="size-5" />
            </div>
            <div className="min-w-0">
              {isCurrent && (
                <Badge className="mb-1">
                  <CheckIcon />
                  Cet appareil
                </Badge>
              )}
              <CardTitle className="min-w-0 text-base leading-snug break-words">
                {parsed.label}
              </CardTitle>
              <CardDescription className="mt-1 min-w-0 text-sm break-words">
                Connecté le {session.createdAt.toLocaleDateString('fr-FR')}{' '}
                {session.ipAddress ? `· IP ${maskIp(session.ipAddress)}` : ''}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
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
  )
}

function maskIp(ip: string): string {
  if (!ip) return ''
  // Mask last octet for a bit of privacy while keeping it identifiable.
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`
  }
  return ip
}
