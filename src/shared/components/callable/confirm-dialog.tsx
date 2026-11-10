import type { MutationFn } from 'react-call/mutation-flow'
import type { ComponentProps, ReactNode } from 'react'
import { createCallable } from 'react-call'
import { useMutationFlow } from 'react-call/mutation-flow'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/shared/components/ui/alert-dialog'
import { Button } from '#/shared/components/ui/button'
import { Spinner } from '#/shared/components/ui/spinner'
import { toast } from '#/shared/components/ui/toast'
import type { ActionResult } from '#/shared/types/action.types'
import { isReauthCancelled } from '#/shared/utils/reauth-error'

type ButtonVariant = ComponentProps<typeof Button>['variant']
type AlertDialogSize = ComponentProps<typeof AlertDialogContent>['size']

export type ConfirmDialogOptions = {
  title: ReactNode
  description?: ReactNode
  content?: ReactNode
  icon?: ReactNode
  confirmLabel?: string
  confirmSubmittingLabel?: string
  cancelLabel?: string
  confirmVariant?: ButtonVariant
  cancelVariant?: ButtonVariant
  size?: AlertDialogSize
}

type ConfirmDialogProps = ConfirmDialogOptions & {
  action?: () => ActionResult | Promise<ActionResult>
}

export const ConfirmDialog = createCallable<ConfirmDialogProps, boolean>(
  ({
    call,
    title = 'Êtes-vous sûr ?',
    description = 'Cette action est irréversible.',
    content,
    icon,
    confirmLabel = 'Confirmer',
    confirmSubmittingLabel,
    cancelLabel = 'Annuler',
    confirmVariant,
    cancelVariant = 'outline',
    size,
    action,
  }) => {
    const mutationFn: MutationFn<boolean> | undefined = action
      ? async (mutationCall) => {
          try {
            const result = await action()

            if (result.error) {
              toast.error(result.message ?? 'Une erreur est survenue')
              return
            }

            mutationCall.end(true)
          } catch (error) {
            if (isReauthCancelled(error)) {
              mutationCall.end(false)
              return
            }

            toast.error('Une erreur est survenue')
          }
        }
      : undefined

    const submit = useMutationFlow(call, mutationFn)

    return (
      <AlertDialog
        open={!call.ended}
        onOpenChange={(open) => {
          if (!open && !call.ended && !submit.pending) call.end(false)
        }}
      >
        <AlertDialogContent size={size}>
          <AlertDialogHeader>
            <AlertDialogTitle className={icon ? 'flex items-center gap-2' : undefined}>
              {icon}
              {title}
            </AlertDialogTitle>
            {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
          </AlertDialogHeader>
          {content}
          <AlertDialogFooter>
            <Button
              variant={cancelVariant}
              disabled={submit.pending}
              onClick={() => call.end(false)}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={confirmVariant}
              disabled={submit.pending}
              onClick={() => submit().orEnd(true)}
            >
              {submit.pending ? (
                <>
                  <Spinner className="mr-2 size-5" /> {confirmSubmittingLabel ?? confirmLabel}
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
  1000
)
