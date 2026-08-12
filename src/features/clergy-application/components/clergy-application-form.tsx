import type { AnyFormGroupApi } from '@tanstack/react-form'
import { CrossIcon } from 'lucide-react'
import {
  ClergyApplicationFormSkeleton,
} from '#/features/clergy-application/components/clergy-application-form-skeleton.tsx'
import {
  CharacterSection,
} from '#/features/clergy-application/components/sections/character-section.tsx'
import {
  DeclarationSection,
} from '#/features/clergy-application/components/sections/declaration-section.tsx'
import { OocSection } from '#/features/clergy-application/components/sections/ooc-section.tsx'
import type {
  ClergyRole,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  clergyApplicationFormOpts,
} from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import { RequireAuth } from '#shared/components/auth/require-auth.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { Spinner } from '#shared/components/ui/spinner.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const ClergyApplicationForm = withForm({
  ...clergyApplicationFormOpts(),
  props: {
    formGroup: {} as AnyFormGroupApi,
    step: '' as unknown as ClergyRole,
    isLoading: true,
  },
  render: function Render({ form, formGroup, step, isLoading }) {
    return (
      <section className="container mx-auto max-w-5xl scroll-mt-32 px-4 py-20 sm:px-6 md:py-28 lg:px-8">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="mx-auto mb-10 max-w-3xl border-b pb-2 text-center text-4xl font-extrabold tracking-tight text-balance text-foreground md:text-5xl">
              Candidature pour le clergé
            </CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous pour postuler comme membre du clergé dans la
              faction. Ce processus est entièrement OOC.
            </CardDescription>
          </CardHeader>
          <RequireAuth className="mx-6" fallback={<ClergyApplicationFormSkeleton />}>
            {isLoading ? (
              <ClergyApplicationFormSkeleton />
            ) : (
              <>
                <CardContent>
                  <FieldGroup>
                    <OocSection form={form} step={step} />
                    <CharacterSection form={form} step={step} />
                    <DeclarationSection form={form} step={step} />
                  </FieldGroup>
                </CardContent>

                <CardFooter className="flex justify-end gap-4">
                  <form.AppForm>
                    <Button
                      form={form.formId}
                      type="submit"
                      size="lg"
                      disabled={
                        !formGroup.state.meta.isValid ||
                        formGroup.state.meta.isSubmitting ||
                        !formGroup.state.meta.canSubmit
                      }
                    >
                      {formGroup.state.meta.isSubmitting ? (
                        <>
                          <Spinner /> Envoi en cours...
                        </>
                      ) : (
                        <>
                          <CrossIcon /> Soumettre ma candidature
                        </>
                      )}
                    </Button>
                  </form.AppForm>
                </CardFooter>
              </>
            )}
          </RequireAuth>
        </Card>
      </section>
    )
  },
})
