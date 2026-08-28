import type { GiftOrderInput } from '#/features/gift-shop/schemas/gift-shop.schema.ts'
import { CIVIL_TITLE } from '#shared/constants/civil-title.ts'
import type { Character } from '#shared/types/character.types.ts'

export function getGiftOrderDefaults(currentCharacter: Character | null | undefined) {
  return {
    items: [],
    title: CIVIL_TITLE.MR,
    firstname: currentCharacter?.firstname ?? '',
    lastname: currentCharacter?.lastname ?? '',
    phone: '',
    address: '',
    fleecaConfirmation: false,
  } as unknown as GiftOrderInput
}
