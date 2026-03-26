import { ComponentPropsWithRef, useTransition } from 'react'
import { Button } from '@/shared/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/components/ui/alert-dialog'
import { LoadingSwap } from '@/shared/components/loading-swap'

type Props = {
  action: (...args: any[]) => Promise<{ error?: boolean; message?: string } | void> | void
  requireAreYouSure?: boolean
  areYouSureTitle?: string
  areYouSureDescription?: string
}

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureTitle = 'Êtes-vous sûr ?',
  areYouSureDescription = 'Cette action est irréversible.',
  ...props
}: Omit<ComponentPropsWithRef<typeof Button>, 'onClick'> & Props) {
  const [isLoading, startTransition] = useTransition()

  function performAction() {
    startTransition(async () => {
      const data = await action()
      if (data?.error) {
        toast.error(data.message ?? 'Erreur')
      }
    })
  }

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{areYouSureTitle}</AlertDialogTitle>
            <AlertDialogDescription>{areYouSureDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap isLoading={isLoading}>Confirmer</LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <Button {...props} disabled={isLoading} onClick={performAction}>
      <LoadingSwap isLoading={isLoading} className="inline-flex items-center gap-2">
        {props.children}
      </LoadingSwap>
    </Button>
  )
}
