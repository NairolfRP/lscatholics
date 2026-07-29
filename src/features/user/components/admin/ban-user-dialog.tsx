import type { PropsWithChildren, ReactElement } from 'react'
import { useState } from 'react'
import { Button } from '#/shared/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '#/shared/components/ui/responsive-dialog'
import { toast } from '#/shared/components/ui/toast'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { useAppForm } from '#/shared/integrations/form/form-hook'
import type { User } from '#/shared/lib/types/auth'
import type { BanUserForm } from '../../schemas/ban-user.schema'
import { banUserFormSchema } from '../../schemas/ban-user.schema'

type Props = PropsWithChildren<{
  user: User
  onSuccess?: ({ bannedUser, closeDialog }: { bannedUser: User; closeDialog: () => void }) => void
}>

export function BanUserDialog({ children, user, onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [endMonth] = useState(() => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))
  const form = useAppForm({
    formId: 'ban-user-form',
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    defaultValues: {
      banReason: '',
    } as BanUserForm,
    validators: {
      onChange: banUserFormSchema,
      onSubmit: banUserFormSchema,
    },
    onSubmit: async ({ value }) => {
      const banExpiresIn = value.banExpiresAt
        ? Math.max(0, Math.floor((value.banExpiresAt.getTime() - Date.now()) / 1000))
        : undefined

      const result = await authClient.admin.banUser({
        userId: user.id,
        banReason: value.banReason,
        banExpiresIn,
      })

      if (result.error) {
        return toast.error(result.error.message)
      }

      if (onSuccess) {
        onSuccess({ bannedUser: result.data.user as User, closeDialog: () => setOpen(false) })
      }
    },
  })
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          form.reset()
          setOpen(false)
          return
        }

        setOpen(true)
      }}
    >
      <ResponsiveDialogTrigger render={children as ReactElement} />
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Bannir {user.name} ?</ResponsiveDialogTitle>
          <ResponsiveDialogDescription />
        </ResponsiveDialogHeader>
        <form
          id={form.formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
        >
          <form.FieldGroup>
            <form.AppField name="banExpiresAt">
              {(field) => <field.DateTimePickerField label="Durée" endMonth={endMonth} />}
            </form.AppField>
            <form.AppField name="banReason">
              {(field) => <field.InputField label="Raison du bannissement" required />}
            </form.AppField>
          </form.FieldGroup>
        </form>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose render={<Button variant="outline">Annuler</Button>} />
          <form.AppForm>
            <form.SubmitButton
              form={form.formId}
              label="Bannir"
              submittingLabel="Traitement..."
              variant="destructive"
            />
          </form.AppForm>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
