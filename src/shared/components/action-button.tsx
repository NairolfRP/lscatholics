import type { ComponentPropsWithRef, ReactNode } from 'react'
import { useState, useTransition } from 'react'
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
} from '#/shared/components/ui/alert-dialog'
import { Button } from '#/shared/components/ui/button'
import { LoadingSwap } from '#/shared/components/ui/loading-swap'

export type ActionButtonReturnType = Promise<{ error: true; message?: string } | { error: false }>

type Props = {
  action: () => ActionButtonReturnType
  requireAreYouSure?: boolean
  areYouSureTitle?: string
  areYouSureDescription?: ReactNode
}

export function ActionButton({
  action,
  requireAreYouSure = false,
  areYouSureTitle = 'Êtes-vous sûr ?',
  areYouSureDescription = 'Cette action est irréversible.',
  ...props
}: ComponentPropsWithRef<typeof Button> & Props) {
  const [isLoading, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  function performAction() {
    startTransition(async () => {
      const data = await action()
      if (data.error) {
        toast.error(data.message ?? 'Une erreur est survenue')
      } else {
        setOpen(false)
      }
    })
  }

  if (requireAreYouSure) {
    return (
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!isLoading) setOpen(next)
        }}
      >
        <AlertDialogTrigger render={<Button {...props} />} />
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
    <Button
      {...props}
      disabled={props.disabled || isLoading}
      onClick={(e) => {
        performAction()
        props.onClick?.(e)
      }}
    >
      <LoadingSwap isLoading={isLoading} className="inline-flex items-center gap-2">
        {props.children}
      </LoadingSwap>
    </Button>
  )
}
