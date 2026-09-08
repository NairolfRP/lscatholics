import { SendIcon } from 'lucide-react'
import { EmploymentApplicationFormSkeleton } from '#/features/job-application/components/employment-application-form-skeleton.tsx'
import { ContactSection } from '#/features/job-application/components/sections/contact-section.tsx'
import { DeclarationSection } from '#/features/job-application/components/sections/declaration-section.tsx'
import { EducationSection } from '#/features/job-application/components/sections/education-section.tsx'
import { ExperienceSection } from '#/features/job-application/components/sections/experience-section.tsx'
import { IdentitySection } from '#/features/job-application/components/sections/identity-section.tsx'
import { OocSection } from '#/features/job-application/components/sections/ooc-section.tsx'
import { ScreeningSection } from '#/features/job-application/components/sections/screening-section.tsx'
import { SpontaneousSection } from '#/features/job-application/components/sections/spontaneous-section.tsx'
import { employmentApplicationFormOptions } from '#/features/job-application/form/employment-application-form-options.ts'
import { spontaneousEmploymentApplicationSchema } from '#/features/job-application/schemas/employment-application.schema.ts'
import { submitEmploymentApplicationFn } from '#/features/job-application/server-fn/employment-application.functions.ts'
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
import { Separator } from '#shared/components/ui/separator.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export function SpontaneousApplicationForm() {
  const { currentCharacter, isLoading } = useGameContext()

  const form = useAppForm({
    ...employmentApplicationFormOptions,
    validators: {
      onChange: spontaneousEmploymentApplicationSchema,
      onSubmit: spontaneousEmploymentApplicationSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await submitEmploymentApplicationFn({
          data: { slug: null, data: value },
        })

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
          title: 'Candidature spontanée envoyée',
          description:
            'Votre candidature spontanée a bien été transmise au Département des Ressources Humaines. Il vous recontactera dans les plus brefs délais.',
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
        <CardTitle className="text-xl font-bold">Candidature spontanée</CardTitle>
        <CardDescription>
          Remplissez le formulaire ci-dessous pour postuler sans offre d'emploi spécifique. Seuls
          les champs marqués d'un astérisque sont obligatoires. Vos informations restent strictement
          confidentielles.
        </CardDescription>
      </CardHeader>
      <RequireAuth className="mx-6" fallback={<EmploymentApplicationFormSkeleton />}>
        {isLoading ? (
          <EmploymentApplicationFormSkeleton />
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
                <SpontaneousSection form={form} />
                <IdentitySection form={form} currentCharacter={currentCharacter} />
                <ContactSection form={form} currentCharacter={currentCharacter} />
                <ScreeningSection form={form} />
                <EducationSection form={form} />
                <ExperienceSection form={form} />
                <DeclarationSection form={form} />
                <Separator />
                <OocSection form={form} />
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex justify-end gap-4">
              <form.AppForm>
                <form.SubmitButton
                  label={
                    <>
                      <SendIcon /> Soumettre ma candidature spontanée
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
