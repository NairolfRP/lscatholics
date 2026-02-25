import { useForm } from 'vee-validate'
import { useCurrentCharacter } from '@/shared/composables/use_current_character'
import { router } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import { toast } from 'vue-sonner'
import { toTypedSchema } from '@vee-validate/zod'
import { employmentApplicationSchema } from '@/features/employment-application/schemas/employment_application.schema'

type UseEmploymentApplicationFormProps = {
  slug: string
}

export function useEmploymentApplicationForm({ slug }: UseEmploymentApplicationFormProps) {
  const currentCharacter = useCurrentCharacter()

  const form = useForm({
    validationSchema: toTypedSchema(employmentApplicationSchema),
    initialValues: {
      firstname: currentCharacter.value?.firstname,
      lastname: currentCharacter.value?.lastname,
      professionalExperience: [],
      applicantDeclaration: [],
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    router.post(
      tuyau.$url('jobs.application_submit', {
        params: {
          slug,
        },
      }),
      data,
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success('Succès', {
            description:
              "Votre demande d'emploi a été enregistrée avec succès. Vous recevrez très bientôt une réponse du Département des Ressources Humaines.",
          })
          form.resetForm()
        },
        onError: (errors) => {
          if ('E_EMPLOYMENT_APPLICATION' in errors) {
            return toast.error('Échec', {
              description: errors.E_EMPLOYMENT_APPLICATION,
            })
          }
          form.setErrors(errors)
        },
      }
    )
  })

  const onReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire ?')) {
      form.resetForm()
    }
  }

  return { ...form, onSubmit, onReset }
}
