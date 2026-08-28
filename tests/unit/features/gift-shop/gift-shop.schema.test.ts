import { describe, expect, it } from 'vitest'
import { GIFT_SHOP_PRODUCTS } from '#/features/gift-shop/constants/gift-shop.constants.ts'
import { giftOrderSchema } from '#/features/gift-shop/schemas/gift-shop.schema.ts'

const validInput = {
  items: [
    { productId: 'chapelet-lourdes', quantity: 2 },
    { productId: 'plaque-priere-irlandaise', quantity: 1 },
  ],
  title: 'mr',
  firstname: ' Jean ',
  lastname: 'Valjean',
  phone: '123 456',
  address: 'La Perla',
  fleecaConfirmation: true,
}

describe('giftOrderSchema', () => {
  it('parses a valid order and normalizes the output', () => {
    const result = giftOrderSchema.parse(validInput)

    expect(result).toEqual({
      items: [
        { productId: 'chapelet-lourdes', quantity: 2 },
        { productId: 'plaque-priere-irlandaise', quantity: 1 },
      ],
      title: 'mr',
      firstname: 'Jean',
      lastname: 'Valjean',
      phone: '123456',
      address: 'La Perla',
      fleecaConfirmation: true,
    })
  })

  it('rejects a missing phone number', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, phone: '   ' })).toThrow(
      'Le numéro de téléphone est requis.'
    )
  })

  it('rejects an invalid title of civility', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, title: 'chevalier' })).toThrow(
      'Veuillez sélectionner votre titre de civilité.'
    )
  })

  it('rejects an empty address', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, address: '   ' })).toThrow(
      "L'adresse ne peut pas être vide."
    )
  })

  it('rejects an address longer than 120 characters', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, address: 'x'.repeat(121) })).toThrow(
      "L'adresse ne doit pas dépasser 120 caractères."
    )
  })

  it('rejects an empty cart', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, items: [] })).toThrow(
      'Votre panier est vide.'
    )
  })

  it('rejects a duplicated product line', () => {
    expect(() =>
      giftOrderSchema.parse({
        ...validInput,
        items: [
          { productId: 'chapelet-lourdes', quantity: 1 },
          { productId: 'chapelet-lourdes', quantity: 2 },
        ],
      })
    ).toThrow("Un article ne peut apparaître qu'une seule fois dans le panier.")
  })

  it('rejects more distinct lines than the catalog holds', () => {
    const overCatalog = GIFT_SHOP_PRODUCTS.length + 1
    expect(() =>
      giftOrderSchema.parse({
        ...validInput,
        items: Array.from({ length: overCatalog }, () => ({
          productId: 'chapelet-lourdes',
          quantity: 1,
        })),
      })
    ).toThrow(
      `Le panier ne peut pas contenir plus de ${GIFT_SHOP_PRODUCTS.length} articles différents.`
    )
  })

  it('rejects a missing product id in a cart line', () => {
    expect(() =>
      giftOrderSchema.parse({
        ...validInput,
        items: [{ productId: '', quantity: 1 }],
      })
    ).toThrow('Ce produit est introuvable.')
  })

  it('rejects an unknown product id in a cart line', () => {
    expect(() =>
      giftOrderSchema.parse({
        ...validInput,
        items: [{ productId: 'lego-jesus', quantity: 1 }],
      })
    ).toThrow('Ce produit est introuvable.')
  })

  it.each([
    [0, "La quantité doit être d'au moins 1."],
    [11, 'La quantité ne peut pas dépasser 10.'],
    [1.5, 'La quantité doit être un nombre entier.'],
  ])('rejects an invalid quantity %d', (quantity, message) => {
    expect(() =>
      giftOrderSchema.parse({
        ...validInput,
        items: [{ productId: 'chapelet-lourdes', quantity }],
      })
    ).toThrow(message)
  })

  it('rejects an empty name', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, firstname: '   ' })).toThrow(
      'Le prénom ne peut pas être vide.'
    )
  })

  it('rejects a phone number with fewer than 3 digits', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, phone: '12' })).toThrow(
      'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects an unconfirmed order', () => {
    expect(() => giftOrderSchema.parse({ ...validInput, fleecaConfirmation: false })).toThrow(
      'Vous devez cocher la confirmation pour continuer.'
    )
  })
})
