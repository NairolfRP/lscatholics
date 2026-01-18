import { useCurrentCharacter } from '@/shared/composables/use_current_character'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { parishionerSchema } from '@/features/register-parishioner/schemas/parishioner.schema'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

export function useParishionerForm() {
  const currentCharacter = useCurrentCharacter()

  return useForm<RegisterParishionerFormValues>({
    validationSchema: toTypedSchema(parishionerSchema),
    initialValues: {
      //recordType: 'new',
      civilTitle: undefined,
      maritalStatus: undefined,
      firstname: currentCharacter.value?.firstname || '',
      lastname: currentCharacter.value?.lastname || '',
      gender: undefined,
      age: undefined,
      ethnicCommunity: 'none',
      occupation: '',
      phone: '',
      emergencyPhone: '',
      address: '',
      district: undefined,
      baptized: undefined,
      religion: undefined,
      parish: undefined,
      familyMembers: [],
      message: '',
      characterSacraments: [],
      oocAdditionalInformation: '',
    },
  })
}
