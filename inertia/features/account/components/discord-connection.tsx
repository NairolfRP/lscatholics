import { usePageProps } from '@/shared/hooks/use_page_props'
import type { AccountSettingsPageProps } from '@/features/account/types/settings'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Unlink } from 'lucide-react'
import { useCallback } from 'react'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import { urlFor } from '@/client'

export function DiscordConnection() {
  const props = usePageProps<AccountSettingsPageProps>()

  const unLinkDiscord = useCallback(() => {
    router.delete(urlFor('discord.unlink'), {
      preserveScroll: true,
      only: ['discordUser'],
      onSuccess: () => {
        toast.success('Succès', { description: 'Votre compte discord a été délié.' })
      },
      onError: () => {
        toast.error('Échec', {
          description:
            'Une erreur est survenue lors de la tentative de déliaison de votre compte Discord.',
        })
      },
    })
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg border bg-linear-to-r from-[#5865F2]/5 to-background">
      <div className="absolute inset-0 bg-[#5865F2]/5 opacity-50" />

      <div className="relative p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2] flex items-center justify-center shadow-md">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Discord</h3>
              <p className="text-sm text-muted-foreground">
                {props.discordUser ? 'Compte lié' : 'Liez votre compte Discord'}
              </p>
            </div>
          </div>

          {props.discordUser ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="relative size-10">
                  {props.discordUser.avatar ? (
                    <AvatarImage src={props.discordUser.avatar} alt={props.discordUser?.username} />
                  ) : null}
                  <AvatarFallback className="bg-linear-to-br from-[#5865F2] to-[#4752C4] text-white font-semibold">
                    {props.discordUser?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{props.discordUser?.username}</span>
              </div>
              <Dialog>
                <DialogTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    aria-label="Supprimer la connexion Discord"
                    title="Délier le compte Discord"
                  >
                    <Unlink /> Délier
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Délier votre compte Discord ?</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-muted-foreground py-4">
                    Vous perdrez l'accès aux fonctionnalités liées à Discord. Vous pourrez toujours
                    relier votre compte ultérieurement.
                  </p>
                  <DialogFooter>
                    <DialogClose as-child>
                      <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <DialogClose as-child>
                      <Button type="button" onClick={unLinkDiscord} variant="destructive">
                        Délier le compte
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white" asChild>
              <a href={urlFor('discord.redirect')}>
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Connecter
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
