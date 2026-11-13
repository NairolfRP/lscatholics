import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { LoaderCircle } from 'lucide-react'
import { updateCurrentCharacterFn } from '#/server-fn/character.functions.ts'
import { toast } from '#/shared/components/ui/toast'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { RadioGroup, RadioGroupItem } from '#shared/components/ui/radio-group.tsx'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '#shared/components/ui/responsive-dialog.tsx'
import { authClient } from '#shared/integrations/auth/auth-client.ts'
import { gameContextQueryOptions } from '#shared/queries/game.queries.ts'
import { Button } from '../ui/button.tsx'
import { FieldLabel } from '../ui/field.tsx'

type Props = {
  open?: boolean
  onOpenChange: (value: boolean) => void
}

export default function SwitchCharacterDialog({ open, onOpenChange }: Props) {
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader className="mb-4 md:mb-0">
          <ResponsiveDialogTitle>(( Changer de personnage ))</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Choisissez quel personnage vous souhaitez utiliser comme personnage actuel sur le site.
            Il vous permettra d'interragir avec des fonctionnalités en son nom.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <SwitchCharacterForm onClose={() => onOpenChange(false)} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function SwitchCharacterForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const {
    data: gameContext,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    ...gameContextQueryOptions,
    staleTime: 5 * 60_000,
    retry: 1,
    enabled: !!session?.user,
  })

  useEffect(() => {
    if (!isSessionPending && !session?.user) {
      onClose()
    }
  }, [isSessionPending, session?.user, onClose])

  const switchCharacterMutation = useMutation({
    mutationFn: async (characterId: number) => updateCurrentCharacterFn({ data: characterId }),
    onSuccess: (result) => {
      void queryClient.setQueryData(gameContextQueryOptions.queryKey, result.data)
      void router.invalidate()
      toast.success(
        `Personnage actuel : ${result.data.currentCharacter.firstname} ${result.data.currentCharacter.lastname}`
      )
      onClose()
    },
    onError: async () => {
      toast.error('Le changement de personnage a échoué')
      await router.invalidate()
      onClose()
    },
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedId) return
    await switchCharacterMutation.mutateAsync(selectedId)
  }

  const dialogContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-4">
          <LoaderCircle className="size-6 animate-spin" />
        </div>
      )
    }

    if (isError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Échec</AlertTitle>
          <AlertDescription>
            L'affichage de la liste des personnages a échoué.
            <Button onClick={() => refetch()} variant="outline" size="sm" className="ml-2">
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    const charactersListWithoutCurrent = gameContext!.characters.filter(
      (c) => c.id !== gameContext!.currentCharacter!.id
    )

    if (charactersListWithoutCurrent.length === 0) {
      return (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">
          Aucun autre personnage disponible.
        </div>
      )
    }

    return (
      <form
        id="switch-character-form"
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col gap-4 px-4 py-2 md:py-0"
      >
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {gameContext?.currentCharacter && (
            <div className="mb-2 flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-3 text-muted-foreground">
              <span className="size-4 rounded-full border border-muted-foreground/40" />
              <span className="text-sm font-medium">
                {gameContext.currentCharacter.firstname} {gameContext.currentCharacter.lastname}
              </span>
              <span className="ml-auto text-xs">Actuel</span>
            </div>
          )}
          <RadioGroup
            id="characterId"
            name="characterId"
            className="flex flex-col gap-2"
            onValueChange={(val) => setSelectedId(Number(val))}
          >
            {charactersListWithoutCurrent.map((character) => (
              <FieldLabel
                key={character.id}
                htmlFor={`${character.id}`}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-3 transition-colors hover:bg-muted has-data-[state=checked]:border-primary/40 has-data-[state=checked]:bg-muted/60"
              >
                <RadioGroupItem id={`${character.id}`} value={`${character.id}`} />
                <span className="text-sm font-medium">
                  {character.firstname} {character.lastname}
                </span>
              </FieldLabel>
            ))}
          </RadioGroup>
        </div>
      </form>
    )
  }

  const cannotSubmit =
    switchCharacterMutation.isPending || isLoading || isError || selectedId === null

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {dialogContent()}

      <ResponsiveDialogFooter className="mt-4 shrink-0 md:mt-0">
        <ResponsiveDialogClose
          render={<Button variant="outline" disabled={switchCharacterMutation.isPending} />}
        >
          Annuler
        </ResponsiveDialogClose>
        <Button type="submit" form="switch-character-form" disabled={cannotSubmit}>
          {switchCharacterMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </ResponsiveDialogFooter>
    </div>
  )
}
