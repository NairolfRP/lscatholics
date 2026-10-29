import { HistoryIcon } from 'lucide-react'
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

type FormDraftRestoreDialogProps = {
  open: boolean
  onRestore: () => void
  onDiscard: () => void
  title?: string
  description?: string
}

export function FormDraftRestoreDialog({
  open,
  onRestore,
  onDiscard,
  title = 'Reprendre votre saisie ?',
  description = 'Un brouillon de ce formulaire a été enregistré. Voulez-vous restaurer son contenu pour continuer où vous en étiez ?',
}: FormDraftRestoreDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <HistoryIcon className="text-primary" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDiscard}>Non, supprimer le brouillon</AlertDialogCancel>
          <AlertDialogAction onClick={onRestore}>Oui, restaurer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
