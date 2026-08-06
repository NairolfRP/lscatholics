import { HeartHandshakeIcon } from 'lucide-react'
import { ContactSection } from '#/features/volunteers/components/sections/contact-section.tsx'
import { EngagementSection } from '#/features/volunteers/components/sections/engagement-section.tsx'
import { IdentitySection } from '#/features/volunteers/components/sections/identity-section.tsx'
import { RequiredHoursSection } from '#/features/volunteers/components/sections/required-hours-section.tsx'
import { SourceSection } from '#/features/volunteers/components/sections/source-section.tsx'
import { VolunteerApplicationFormSkeleton } from '#/features/volunteers/components/volunteer-application-form-skeleton.tsx'
import { getVolunteerDefaults } from '#/features/volunteers/constants/volunteer-defaults.ts'
import { volunteerApplicationSchema } from '#/features/volunteers/schemas/volunteer-application.schema.ts'
import { submitVolunteerApplicationFn } from '#/features/volunteers/server-fn/volunteer-application.functions.ts'
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

export function VolunteerApplicationForm() {
  const { currentCharacter, isLoading } = useGameContext()

  const form = useAppForm({
    formId: 'volunteer-application-submission-form',
    validators: {
      onChange: volunteerApplicationSchema,
      onSubmit: volunteerApplicationSchema,
    },
    defaultValues: getVolunteerDefaults(currentCharacter),
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await submitVolunteerApplicationFn({ data: value })

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
          title: 'Candidature envoyée',
          description:
            'Votre candidature pour le bénévolat a été soumise avec succès. Nous vous recontacterons dans les plus brefs délais.',
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
        <CardTitle className="text-xl font-bold">Rejoindre l'équipe de bénévoles</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour proposer votre aide. Seuls les champs marqués
          d'un astérisque sont obligatoires — les autres sections nous aident à mieux connaître
          votre profil.
        </CardDescription>
      </CardHeader>
      <RequireAuth className="mx-6" fallback={<VolunteerApplicationFormSkeleton />}>
        {isLoading ? (
          <VolunteerApplicationFormSkeleton />
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
                <EngagementSection form={form} />
                <SourceSection form={form} />
                <RequiredHoursSection form={form} />
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <form.AppForm>
                <form.SubmitButton
                  label={
                    <>
                      <HeartHandshakeIcon /> Soumettre ma candidature
                    </>
                  }
                  submittingLabel="Envoi en cours..."
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
