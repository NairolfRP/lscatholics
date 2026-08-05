import type { ParishionerFormInput } from '#/features/parishioner/schemas/parishioner.schema.ts'
import {
  PARISHIONER_PARISH_UNSURE_VALUE,
} from '#/features/parishioner/schemas/parishioner.schema.ts'
import type { Character } from '#shared/types/character.types.ts'

export function getParishionerDefaultValues(currentCharacter: Character | null | undefined) {
  return {
    civilTitle: '',
    maritalStatus: '',
    firstname: currentCharacter?.firstname ?? '',
    lastname: currentCharacter?.lastname ?? '',
    gender: '',
    age: '',
    ethnicCommunity: '',
    occupation: '',
    phone: '',
    emergencyPhone: '',
    address: '',
    district: '',
    baptized: '',
    religion: '',
    parish: PARISHIONER_PARISH_UNSURE_VALUE,
    isVolunteer: false,
    familyMembers: [],
    message: '',
    characterSacraments: [],
    oocAdditionalInformation: '',
  } as unknown as ParishionerFormInput
}
