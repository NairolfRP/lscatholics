import { withForm } from '@/shared/hooks/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { ActionButton } from '@/shared/components/action-button'
import { Button } from '@/shared/components/ui/button'
import { Field } from '@/shared/components/ui/field'

export const VolunteerApplicationButtons = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => {
    const handleReset = () => {
      form.reset()
    }

    return (
      <Field orientation="horizontal" className="gap-8 justify-center-safe md:justify-end-safe">
        <ActionButton
          type="button"
          variant="outline"
          areYouSureTitle="Êtes-vous sûr de vouloir réinitialiser le formulaire ?"
          action={handleReset}
          requireAreYouSure
        >
          Réinitialiser
        </ActionButton>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isValidating]}
        >
          {([canSubmit, isSubmitting, isValidating]) => (
            <Button
              type="submit"
              form="volunteer-application-form"
              disabled={!canSubmit || isSubmitting || isValidating}
            >
              Soumettre
            </Button>
          )}
        </form.Subscribe>
      </Field>
    )
  },
})
