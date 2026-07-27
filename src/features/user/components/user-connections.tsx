import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BadgeCheckIcon, UnlinkIcon } from 'lucide-react'
import { toast } from '#/shared/components/ui/toast'
import { ActionButton } from '#/shared/components/action-button'
import DiscordIcon from '#/shared/components/icons/discord'
import { Avatar, AvatarFallback, AvatarImage } from '#/shared/components/ui/avatar'
import { Button } from '#/shared/components/ui/button'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { discordConnectionQueryKey, discordConnectionQueryOptions } from '../queries'

export function UserConnections() {
  return <DiscordConnection />
}

function DiscordConnection() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const queryClient = useQueryClient()

  const {
    data: discordAccount,
    isLoading,
    isError: isQueryError,
  } = useQuery({
    ...discordConnectionQueryOptions(session?.session.id),
    enabled: !isSessionPending,
  })

  const linkMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.linkSocial({
        provider: 'discord',
        callbackURL: '/account/settings',
      })
      if (error) {
        if (error.code === 'PROVIDER_NOT_FOUND') {
          throw new Error('PROVIDER_NOT_FOUND')
        }

        throw new Error('Failed to redirect to Discord for linking account.')
      }
    },
    onError: (err) => {
      if (err.message === 'PROVIDER_NOT_FOUND') {
        return toast.error(
          'La liaison de compte Discord a été désactivée pour le moment ou rencontre des problèmes. Réessayez plus tard.'
        )
      }

      toast.error('Une erreur est survenue')
    },
  })

  const unlinkMutation = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.unlinkAccount({ providerId: 'discord' })
      if (error) {
        return { error: true, message: error.message }
      }
      toast.success('Compte Discord délié')
      void queryClient.invalidateQueries(discordConnectionQueryKey(session?.session.id))
      return { error: false }
    },
  })

  if (isLoading || isSessionPending) {
    return <Skeleton className="h-26 w-full rounded-md" />
  }

  if (isQueryError) {
    return <>Une erreur est survenue</>
  }

  return (
    <div className="relative overflow-hidden rounded-lg border bg-linear-to-r from-[#5865F2]/5 to-background">
      <div className="absolute inset-0 bg-[#5865F2]/5 opacity-50" />

      <div className="relative p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5865F2] shadow-md">
              <DiscordIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Discord</h3>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                {discordAccount ? (
                  <>
                    <BadgeCheckIcon className="size-4" /> Compte lié
                  </>
                ) : (
                  '(Facultatif) Liez votre compte Discord'
                )}
              </span>
            </div>
          </div>

          {discordAccount ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="relative size-10">
                  {discordAccount.avatar ? (
                    <AvatarImage src={discordAccount.avatar} alt={discordAccount.username} />
                  ) : null}
                  <AvatarFallback className="bg-linear-to-br from-[#5865F2] to-[#4752C4] font-semibold text-white">
                    {discordAccount.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{discordAccount.username}</span>
              </div>
              <ActionButton
                requireAreYouSure
                areYouSureTitle="Délier votre compte Discord ?"
                areYouSureDescription="Vous perdrez l'accès aux fonctionnalités liées à Discord. Vous pourrez toujours relier votre compte ultérieurement."
                action={unlinkMutation.mutateAsync}
                variant="ghost"
                size="sm"
                className="cursor-pointer text-destructive hover:text-destructive"
                aria-label="Supprimer la connexion Discord"
                title="Délier le compte Discord"
              >
                <UnlinkIcon /> Délier
              </ActionButton>
            </div>
          ) : (
            <Button
              className="bg-[#5865F2] text-white hover:bg-[#4752C4]"
              onClick={() => linkMutation.mutate()}
            >
              <DiscordIcon className="mr-2 h-4 w-4" />
              Connecter
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
