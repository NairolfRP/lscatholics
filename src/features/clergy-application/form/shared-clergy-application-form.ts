import type { AnyFormGroupApi } from '@tanstack/react-form'
import { formOptions } from '@tanstack/react-form'
import type { ClergyRole } from '#/features/clergy-application/constants/clergy-application.constants'
import { CLERGY_ROLE } from '#/features/clergy-application/constants/clergy-application.constants'
import type { PermanentDeaconApplicationInput } from '#/features/clergy-application/schemas/clergy-application.schema'
import { submitClergyApplicationFn } from '#/features/clergy-application/server-fn/clergy-application.functions.ts'
import { toast } from '#shared/components/ui/toast.tsx'

const sharedDefaultValues = (
  { firstname = '', lastname = '' }: { firstname?: string; lastname?: string } = {
    firstname: '',
    lastname: '',
  }
) => ({
  discordUsername: '',
  sanctions: '',
  firstname,
  lastname,
  age: '',
  characterStory: '',
  motivations: '',
  noTrollingDeclaration: false,
  legalOnlyDeclaration: false,
})

export const clergyApplicationFormOpts = (
  { firstname = '', lastname = '' }: { firstname?: string; lastname?: string } = {
    firstname: '',
    lastname: '',
  }
) =>
  formOptions({
    defaultValues: {
      [CLERGY_ROLE.PRIEST]: {
        ...sharedDefaultValues({ firstname, lastname }),
      },
      [CLERGY_ROLE.DEACON_TEMPORARY]: {
        ...sharedDefaultValues({ firstname, lastname }),
      },
      [CLERGY_ROLE.DEACON_PERMANENT]: {
        ...sharedDefaultValues({ firstname, lastname }),
        maritalStatus: undefined,
      } as unknown as PermanentDeaconApplicationInput,
    },
  })

export async function handleSubmitClergyApplication(
  role: ClergyRole,
  values: {
    [x: string]: unknown
  },
  formGroupApi: AnyFormGroupApi
) {
  try {
    const result = await submitClergyApplicationFn({ data: { role, values } })

    if (!result.success) {
      if (result.validationErrors) {
        return formGroupApi.form.setErrorMap({
          onServer: {
            fields: result.validationErrors,
          },
        })
      }

      return toast.add({ type: 'error', title: result.error || 'Une erreur est survenue' })
    }

    toast.add({
      type: 'success',
      title: 'Candidature envoyée',
      description:
        '(( Ta candidature pour le clergé a été soumise avec succès. Nous reviendrons vers toi dès que possible ! ))',
    })
    formGroupApi.form.reset()
  } catch {
    toast.add({ type: 'error', title: 'Une erreur est survenue' })
  }
}
