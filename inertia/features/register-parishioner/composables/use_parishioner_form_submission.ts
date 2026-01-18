import { usePageProps } from '@/shared/composables/use_page_props'
import { useErrors } from '@/shared/composables/use_errors'
import { router } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import { toast } from 'vue-sonner'
import type { FormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

export function useParishionerFormSubmission(form: FormContext<RegisterParishionerFormValues>) {
  const props = usePageProps()
  const errors = useErrors()

  const onSubmit = form.handleSubmit((formValues) => {
    router.post(tuyau['register-parishioner'].$url(), formValues, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        if (props.value.success) {
          form.resetForm()
          return toast.success('Succès !', {
            description: props.value.success || 'Soumis avec succès !',
          })
        }
        toast.error(errors.value.E_REGISTER_PARISHIONER_ERROR || 'Une erreur est survenue.')
      },
      onError: (err) => {
        if (err) {
          if (!('E_REGISTER_PARISHIONER_ERROR' in err)) {
            form.setErrors(err)
            return toast.error('Champs invalides', {
              description: 'Veuillez corriger les erreurs dans le formulaire',
            })
          }

          toast.error('Échec', { description: err.E_REGISTER_PARISHIONER_ERROR })
        }
      },
    })
  })

  return { onSubmit }
}
