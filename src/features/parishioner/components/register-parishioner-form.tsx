import {
  RegisterParishionerFormSkeleton,
} from '#/features/parishioner/components/register-parishioner-form-skeleton.tsx'
import { ContactSection } from '#/features/parishioner/components/sections/contact-section.tsx'
import { FaithSection } from '#/features/parishioner/components/sections/faith-section.tsx'
import { HouseholdSection } from '#/features/parishioner/components/sections/household-section.tsx'
import { IdentitySection } from '#/features/parishioner/components/sections/identity-section.tsx'
import { OocSection } from '#/features/parishioner/components/sections/ooc-section.tsx'
import {
  getParishionerDefaultValues,
} from '#/features/parishioner/constants/parishioner-defaults.ts'
import { parishionerSchema } from '#/features/parishioner/schemas/parishioner.schema.ts'
import {
  submitRegisterParishionerFn,
} from '#/features/parishioner/server-fn/register-parishioner.functions.ts'
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

export function RegisterParishionerForm() {
  const { currentCharacter, isLoading } = useGameContext()

  const form = useAppForm({
    formId: 'register-parishioner-submission-form',
    validators: {
      onChange: parishionerSchema,
      onSubmit: parishionerSchema,
    },
    defaultValues: getParishionerDefaultValues(currentCharacter),
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await submitRegisterParishionerFn({ data: value })

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
          title: 'Félicitations',
          description: 'Votre foyer a été enregistré comme paroissien avec succès.',
        })
        formApi.reset()
      } catch {
        toast.add({ type: 'error', title: 'Une erreur est survenue' })
      }
    },
  })

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Enregistrement de votre foyer</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour enregistrer votre foyer comme paroissien de
          l'Église catholique de Los Santos. Seuls les champs marqués d'un astérisque sont
          obligatoires.
        </CardDescription>
      </CardHeader>
      <RequireAuth className="mx-6" fallback={<RegisterParishionerFormSkeleton />}>
        {isLoading ? (
          <RegisterParishionerFormSkeleton />
        ) : (
          <form
            id={form.formId}
            onSubmit={(e) => {
              e.preventDefault()
              void form.handleSubmit()
            }}
            className="contents"
          >
            <CardContent>
              <FieldGroup>
                <IdentitySection form={form} currentCharacter={currentCharacter} />
                <ContactSection form={form} />
                <FaithSection form={form} />
                <HouseholdSection form={form} />
                <OocSection form={form} />
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <form.AppForm>
                <form.SubmitButton
                  label="Soumettre l'enregistrement"
                  submittingLabel="Soumission en cours..."
                  size="lg"
                />
              </form.AppForm>
            </CardFooter>
          </form>
        )}
      </RequireAuth>
    </Card>
  )
}
