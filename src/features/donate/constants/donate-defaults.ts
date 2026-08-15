import type { DonationInput } from '#/features/donate/schemas/donate.schema.ts'
import type { Character } from '#shared/types/character.types.ts'

export function getDonationDefaults(currentCharacter: Character | null | undefined) {
  return {
    amount: undefined,
    firstname: currentCharacter?.firstname ?? '',
    lastname: currentCharacter?.lastname ?? '',
    age: '',
    ethnicity: null,
    phone: '',
    address: '',
    district: '',
    isOrganization: false,
    organizationName: '',
    message: '',
    anonymous: false,
    fleecaConfirmation: false,
  } as unknown as DonationInput
}
