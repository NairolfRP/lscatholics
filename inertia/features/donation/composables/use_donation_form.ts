import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useCurrentCharacter } from '@/shared/composables/use_current_character'
import { PREDEFINED_AMOUNTS } from '@/features/donation/constants/donate.constants'
import { donateSchema } from '@/features/donation/schemas/donate.schema'

export function useDonationForm() {
  const currentCharacter = useCurrentCharacter()

  const form = useForm({
    validationSchema: toTypedSchema(donateSchema),
    initialValues: {
      amount: undefined,
      firstname: currentCharacter.value?.firstname || '',
      lastname: currentCharacter.value?.lastname || '',
      age: undefined,
      ethnicity: undefined,
      phone: '',
      address: '',
      district: undefined,
      isOrganization: false,
      organizationName: '',
      anonymous: false,
      fleecaConfirmation: false,
    },
  })

  return {
    ...form,
    predefinedAmounts: PREDEFINED_AMOUNTS,
  }
}
