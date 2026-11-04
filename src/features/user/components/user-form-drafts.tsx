import { useState } from 'react'
import { FileTextIcon, Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/shared/components/ui/alert-dialog'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '#/shared/components/ui/empty'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { formatDateTime } from '#/utils/date.ts'
import { useFormDrafts } from '../hooks/use-form-drafts'

type PendingDeletion = { mode: 'single'; storageKey: string } | { mode: 'all' } | null

export function UserFormDrafts() {
  const { drafts, isLoading, deleteDraft, clearDrafts } = useFormDrafts()
  const [pendingDeletion, setPendingDeletion] = useState<PendingDeletion>(null)

  const confirmDeletion = () => {
    if (pendingDeletion?.mode === 'single') {
      deleteDraft(pendingDeletion.storageKey)
    } else {
      clearDrafts()
    }
    setPendingDeletion(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <FileTextIcon /> Brouillons de formulaires
        </CardTitle>
        <CardDescription>
          Certains formulaires enregistrent automatiquement votre saisie dans ce navigateur afin de
          pouvoir la reprendre plus tard. Vous pouvez consulter et supprimer ces brouillons ici.
        </CardDescription>
        {!isLoading && drafts.length > 0 && (
          <CardAction className="pl-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setPendingDeletion({ mode: 'all' })}
            >
              <Trash2Icon /> Tout supprimer
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </div>
        ) : drafts.length === 0 ? (
          <Empty className="border">
            <EmptyMedia variant="icon">
              <FileTextIcon />
            </EmptyMedia>
            <EmptyTitle>Aucun brouillon enregistré</EmptyTitle>
            <EmptyDescription>
              Les brouillons de formulaires sauvegardés dans ce navigateur apparaîtront ici.
            </EmptyDescription>
          </Empty>
        ) : (
          <ul className="divide-y rounded-lg border">
            {drafts.map((draft) => (
              <li
                key={draft.storageKey}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{draft.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {draft.savedAt
                      ? `Enregistré le ${formatDateTime(new Date(draft.savedAt))}`
                      : 'Date d’enregistrement inconnue'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-muted-foreground hover:text-destructive"
                  aria-label={`Supprimer le brouillon : ${draft.label}`}
                  onClick={() =>
                    setPendingDeletion({ mode: 'single', storageKey: draft.storageKey })
                  }
                >
                  <Trash2Icon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <AlertDialog
        open={pendingDeletion !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeletion(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDeletion?.mode === 'single'
                ? 'Supprimer ce brouillon ?'
                : 'Supprimer tous les brouillons ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeletion?.mode === 'single'
                ? 'Ce brouillon sera définitivement supprimé de ce navigateur. Cette action est irréversible.'
                : 'Tous les brouillons de formulaires enregistrés dans ce navigateur seront définitivement supprimés. Cette action est irréversible.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDeletion}>
              Oui, supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
