import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { usePageProps } from '@/shared/hooks/use_page_props'
import type { AccountSettingsPageProps } from '@/features/account/types/settings'
import { Trash, TriangleAlert } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { Input } from '@/shared/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { Field, FieldError } from '@/shared/components/ui/field'
import { router } from '@inertiajs/react'
import { urlFor } from '@/client'
import { deleteAccountSchema } from '@/features/account/schemas/delete_account_schema'
import { serverErrorsFormConvertor } from '@/lib/utils'

export function DangerZone() {
  const props = usePageProps<AccountSettingsPageProps>()

  const form = useForm({
    validators: {
      onChange: deleteAccountSchema(props.user!.name),
    },
    defaultValues: {
      username: '',
    },
    onSubmit: ({ value }) => {
      router.delete(urlFor('account.delete'), {
        data: value,
        onError: (err) => {
          form.setErrorMap({
            onSubmit: serverErrorsFormConvertor(err),
          })
        },
      })
    },
  })

  return (
    <Card className="pb-0 mb-0 border-destructive/40">
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
      <CardFooter className="flex justify-end py-3 bg-destructive/10">
        <Dialog>
          <DialogTrigger>
            <Button variant="destructive" className="cursor-pointer">
              <Trash className="mr-2" /> Supprimer mon compte
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
            </DialogHeader>
            <Alert variant="warning">
              <TriangleAlert />
              <AlertTitle>Cette action sera irréversible et immédiate.</AlertTitle>
            </Alert>
            <form
              id="deleteUserForm"
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <form.Field name="username">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={`Entrez ici « ${props.user!.name} » pour confirmer`}
                        autoComplete="off"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            </form>
            <DialogFooter>
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="destructive"
                    className="w-full"
                    form="deleteUserForm"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? 'Suppression du compte...' : 'Supprimer ce compte'}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
