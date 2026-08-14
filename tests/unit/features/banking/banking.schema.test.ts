import { describe, expect, it } from 'vitest'
import { bankTransferSchema } from '#/features/banking/schema/banking.schema.ts'

const validInput = {
  iban: '010012345',
  amount: 1000,
  description: 'Achat de fournitures',
}

describe('bankTransferSchema', () => {
  it('parses a valid transfer and trims the description', () => {
    const result = bankTransferSchema.parse({
      ...validInput,
      description: '  Achat de fournitures  ',
      comment: ' Bon de commande ',
    })

    expect(result).toEqual({
      iban: '010012345',
      amount: 1000,
      description: 'Achat de fournitures',
      comment: ' Bon de commande ',
    })
  })

  it('makes the comment optional', () => {
    const result = bankTransferSchema.parse(validInput)

    expect(result.comment).toBeUndefined()
  })

  it('rejects an invalid IBAN', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, iban: '123456789' })).toThrow(
      "Le format de l'IBAN n'est pas valide"
    )
  })

  it.each([
    ['missing', undefined],
    ['null', null],
    ['empty string', ''],
  ])('rejects a %s amount as required', (_label, amount) => {
    expect(() => bankTransferSchema.parse({ ...validInput, amount })).toThrow(
      'Le montant de la transaction est requis.'
    )
  })

  it('rejects a non-integer amount', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, amount: 500.5 })).toThrow(
      'Le montant doit être un nombre entier valide.'
    )
  })

  it('rejects an amount below the minimum', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, amount: 100 })).toThrow(
      /Le montant minimum de la transaction est de/
    )
  })

  it('rejects an amount above the maximum', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, amount: 1_000_001 })).toThrow(
      /ne peut pas être effectuée via ce système/
    )
  })

  it('rejects a description shorter than 2 characters', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, description: 'x' })).toThrow(
      'Le libellé doit au minimum faire 2 caractères.'
    )
  })

  it('rejects a description longer than 50 characters', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, description: 'x'.repeat(51) })).toThrow(
      'Le libellé ne doit pas dépasser 50 caractères.'
    )
  })

  it('rejects a comment longer than 1000 characters', () => {
    expect(() => bankTransferSchema.parse({ ...validInput, comment: 'x'.repeat(1001) })).toThrow(
      'Le commentaire ne doit pas dépasser 1000 caractères.'
    )
  })
})
