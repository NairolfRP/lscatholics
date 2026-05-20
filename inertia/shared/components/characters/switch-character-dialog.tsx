import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { router } from '@inertiajs/react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Label } from '@/shared/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { api, urlFor } from '@/lib/client'
import { useUser } from '@/shared/hooks/use_user'
import { useQuery } from '@tanstack/react-query'

type Props = {
  open?: boolean
  onOpenChange: (value: boolean) => void
}

export default function SwitchCharacterDialog({ open, onOpenChange }: Props) {
  const user = useUser()
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | undefined>(undefined)

  const charactersQuery = useQuery({
    ...api.characters.list.queryOptions(),
    enabled: open === true,
    staleTime: 5 * 60_000,
    retry: 1,
  })

  const currentCharacterId = user?.currentCharacter?.id
  const otherCharacters = (charactersQuery.data?.characters ?? []).filter(
    (c) => c.id !== currentCharacterId
  )

  const handleSwitchCharacter = (characterId: number | undefined) => {
    if (characterId === undefined) return

    router.patch(
      urlFor('characters.current'),
      { id: characterId },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess() {
          setSelectedCharacterId(undefined)
          router.reload({ only: ['user', 'canAccessDashboard'] })
          onOpenChange(false)
        },
      }
    )
  }

  const renderContent = () => {
    if (charactersQuery.isLoading) {
      return (
        <div className="flex justify-center py-4">
          <LoaderCircle className="animate-spin size-6" />
        </div>
      )
    }

    if (charactersQuery.isError) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Échec</AlertTitle>
          <AlertDescription>
            L'affichage de la liste des personnages a échoué.
            <Button
              onClick={() => charactersQuery.refetch()}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSwitchCharacter(selectedCharacterId)
        }}
        className="grid items-start gap-4 px-4"
      >
        <RadioGroup
          className="flex flex-col gap-6 mb-5"
          value={selectedCharacterId?.toString() ?? ''}
          onValueChange={(val) => setSelectedCharacterId(Number(val))}
        >
          {otherCharacters.map((character) => (
            <div key={character.id} className="flex items-center space-x-2">
              <RadioGroupItem id={`${character.id}`} value={`${character.id}`} />
              <Label htmlFor={`${character.id}`}>
                {character.firstname} {character.lastname}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <Button type="submit" disabled={selectedCharacterId === undefined}>
          Sélectionner le personnage
        </Button>
      </form>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>(( Changer de personnage ))</DialogTitle>
          <DialogDescription>
            Choisissez quel personnage vous souhaitez utiliser comme personnage actuel sur le site.
            Il vous permettra d'interragir avec des fonctionnalités en son nom.
          </DialogDescription>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
