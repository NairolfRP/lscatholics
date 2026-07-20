import { ShieldAlert } from 'lucide-react'
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

type ReauthModalProps = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function RequireReauthDialog({ open, onConfirm, onCancel }: ReauthModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <ShieldAlert className="text-warning" />
            Session trop ancienne
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pour des raisons de sécurité, vous devez rafraichir votre session avant d'effectuer
            cette action. Vous allez être redirigé vers le service de connexion, puis
            automatiquement renvoyé ici.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Se ré-authentifier</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
