import { SendIcon } from 'lucide-react'
import { ContactFormSkeleton } from '#/features/contact/components/contact-form-skeleton.tsx'
import { contactSubjectOptions } from '#/features/contact/constants/contact-subjects.ts'
import { contactSchema } from '#/features/contact/schemas/contact.schema.ts'
import { submitContactFn } from '#/features/contact/server-fn/contact.functions.ts'
import { RequireAuth } from '#shared/components/auth/require-auth.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export function ContactForm() {
  const { currentCharacter } = useGameContext()

  const form = useAppForm({
    formId: 'contact-message-form',
    validators: {
      onChange: contactSchema,
      onSubmit: contactSchema,
    },
    defaultValues: {
      firstName: currentCharacter?.firstname ?? '',
      lastName: currentCharacter?.lastname ?? '',
      phone: '',
      subject: '',
      message: '',
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await submitContactFn({ data: value })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.add({ type: 'error', title: result.error || 'Une erreur est survenue' })
      }

      toast.add({
        type: 'success',
        title: 'Soumis avec succès',
        description:
          'Votre demande de contact a été soumise avec succès. Un membre du personnel vous recontactera par téléphone dès que possible.',
      })
      formApi.reset()
    },
  })

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Envoyez-nous un message</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous, votre demande sera transmise au service concerné.
        </CardDescription>
      </CardHeader>
      <RequireAuth className="mx-6" fallback={<ContactFormSkeleton />}>
        <CardContent>
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
            className="contents"
          >
            <FieldGroup>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <form.AppField name="firstName">
                  {(field) => (
                    <field.InputField
                      key={`current-character-firstname-${currentCharacter?.id !== undefined ? currentCharacter.id : 'unknown'}`}
                      label="Prénom"
                      placeholder="John"
                      required
                      autoComplete="off"
                    />
                  )}
                </form.AppField>

                <form.AppField name="lastName">
                  {(field) => (
                    <field.InputField
                      key={`current-character-lastname-${currentCharacter?.id !== undefined ? currentCharacter.id : 'unknown'}`}
                      label="Nom de famille"
                      placeholder="Doe"
                      required
                      autoComplete="off"
                    />
                  )}
                </form.AppField>
              </div>

              <form.AppField name="phone">
                {(field) => (
                  <field.InputField
                    type="tel"
                    inputMode="tel"
                    label="Téléphone"
                    placeholder="1234"
                    required
                    autoComplete="off"
                    className="max-w-92"
                  />
                )}
              </form.AppField>

              <form.AppField name="subject">
                {(field) => (
                  <field.SelectField
                    label="Sujet"
                    description="Choisissez le service le plus adapté à votre demande."
                    placeholder="Sélectionnez un sujet"
                    errorsPos="after"
                    values={contactSubjectOptions}
                    required
                  />
                )}
              </form.AppField>

              <form.AppField name="message">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <field.TextareaField
                      label="Message"
                      placeholder="Décrivez votre demande en détail..."
                      rows={10}
                      maxLength={2000}
                      required
                    />
                    <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                      <span className="tabular-nums">{field.state.value.length}/2000</span>
                    </div>
                  </div>
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-start gap-4">
          <form.AppForm>
            <form.SubmitButton
              variant="secondary"
              label={
                <>
                  <SendIcon /> Soumettre
                </>
              }
              submittingLabel="Envoi en cours..."
              size="lg"
              className="w-full"
            />
          </form.AppForm>
        </CardFooter>
      </RequireAuth>
    </Card>
  )
}
