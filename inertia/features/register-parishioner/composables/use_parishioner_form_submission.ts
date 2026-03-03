import { usePageProps } from '@/shared/composables/use_page_props'
import { useErrors } from '@/shared/composables/use_errors'
import { router } from '@inertiajs/vue3'
import { urlFor } from '@/client'
import { toast } from 'vue-sonner'
import type { FormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

export function useParishionerFormSubmission(form: FormContext<RegisterParishionerFormValues>) {
  const props = usePageProps()
  const errors = useErrors()

  const onSubmit = form.handleSubmit((formValues) => {
    router.post(urlFor('registerParishioner.submit'), formValues, {
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
        form.setErrors(err)
      },
    })
  })

  return { onSubmit }
}
