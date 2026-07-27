import { useState } from 'react'
import { useRouteContext, useRouter } from '@tanstack/react-router'
import { Trash, TriangleAlert } from 'lucide-react'
import { toast } from '#/shared/components/ui/toast'
import { deleteUserFn } from '#/features/user/server-fn/user.functions'
import { Alert, AlertTitle } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/shared/components/ui/dialog'
import { useReauth } from '#/shared/hooks/auth/use-reauth'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { useAppForm } from '#/shared/integrations/form/form-hook'
import { RequireReauthProvider } from '#/shared/providers/require-reauth-provider'
import { deleteUserFormSchema } from '../schemas/delete-user-schema'

export function UserDangerZone() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Card className="mb-0 border-destructive/40 pb-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-destructive">
          <Trash /> Danger Zone
        </CardTitle>
        <CardDescription>
          Toutes les informations et les données associées à votre compte seront définitivement et
          instantanément effacées. Avant de supprimer votre compte, veillez à sauvegarder toutes les
          informations que vous souhaitez conserver.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end bg-destructive/10 py-3">
        <RequireReauthProvider cancelCallbackURL="/account/settings">
          <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
            <DialogTrigger render={<Button variant="destructive" className="cursor-pointer" />}>
              <Trash className="mr-2" /> Supprimer mon compte
            </DialogTrigger>
            <DialogContent>
              <DeleteUserConfirmation closeDialog={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </RequireReauthProvider>
      </CardFooter>
    </Card>
  )
}

function DeleteUserConfirmation({ closeDialog }: { closeDialog: () => void }) {
  const { withFreshSession } = useReauth()
  const { user } = useRouteContext({ from: '/_app/account/settings' })
  const router = useRouter()

  const form = useAppForm({
    formId: 'deleteUserForm',
    defaultValues: {
      typedUsername: '',
    },
    validators: {
      onMount: deleteUserFormSchema(user.name),
      onChange: deleteUserFormSchema(user.name),
    },
    onSubmit: async ({ value, formApi }) => {
      return withFreshSession(async () => {
        const result = await deleteUserFn({ data: value })

        if (!result.success) {
          if (result.validationErrors) {
            return formApi.setErrorMap({
              onServer: {
                fields: result.validationErrors,
              },
            } as unknown as Parameters<typeof formApi.setErrorMap>[0])
          }

          if (result.error.status !== 500) {
            closeDialog()
            throw result.error
          }

          toast.error('Une erreur est survenue lors de la suppression de votre compte')
          return closeDialog()
        }

        await authClient.signOut()
        void router.invalidate()
        toast.info('Votre compte a été supprimé. Dieu vous bénisse !')
      })
    },
  })

  return (
    <>
      <DialogHeader>
        <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
        <DialogDescription />
        <Alert variant="warning">
          <TriangleAlert />
          <AlertTitle>Cette action sera irréversible et immédiate.</AlertTitle>
        </Alert>
      </DialogHeader>
      <form
        id={form.formId}
        onSubmit={(e) => {
          e.preventDefault()
          void form.handleSubmit()
        }}
      >
        <form.AppField name="typedUsername">
          {(field) => (
            <field.InputField
              type="text"
              label={
                <>
                  Saisissez <strong>{user.name}</strong> pour confirmer
                </>
              }
              placeholder={user.name}
              autoComplete="off"
              // oxlint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          )}
        </form.AppField>
      </form>
      <DialogFooter>
        <form.AppForm>
          <form.SubmitButton
            form={form.formId}
            variant="destructive"
            label="Supprimer ce compte"
            submittingLabel="Suppression du compte..."
            className="w-full"
          />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}
