import { formOptions, type StandardSchemaV1 } from '@tanstack/react-form'
import type { Character } from '#characters/types/character'
import { parishionerSchema } from '@/features/register-parishioner/schemas/parishioner.schema'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/register_parishioner'

export const registerParishionerFormOpts = (currentCharacter: Character) => {
  return formOptions({
    validators: {
      onChange: parishionerSchema as unknown as StandardSchemaV1<RegisterParishionerFormValues>,
    },
    defaultValues: {
      civilTitle: '',
      maritalStatus: '',
      firstname: currentCharacter?.firstname || '',
      lastname: currentCharacter?.lastname || '',
      gender: '',
      age: undefined,
      ethnicCommunity: 'none',
      occupation: '',
      phone: '',
      emergencyPhone: '',
      address: '',
      district: '',
      baptized: '',
      religion: '',
      parish: '',
      familyMembers: [],
      message: '',
      characterSacraments: [],
      oocAdditionalInformation: '',
    } as unknown as RegisterParishionerFormValues,
  })
}
