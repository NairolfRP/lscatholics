import { describe, expect, it } from 'vitest'
import { donationSchema } from '#/features/donate/schemas/donate.schema.ts'

const validInput = {
  amount: 500,
  firstname: ' Jean ',
  lastname: 'Valjean',
  age: '46',
  ethnicity: 'white',
  phone: '123 456',
  address: '12 Ginger Street',
  district: 'little_seoul',
  isOrganization: false,
  organizationName: '',
  anonymous: false,
  fleecaConfirmation: true,
}

describe('donationSchema', () => {
  it('parses a valid donation and normalizes the output', () => {
    const result = donationSchema.parse(validInput)

    expect(result).toEqual({
      amount: 500,
      firstname: 'Jean',
      lastname: 'Valjean',
      age: 46,
      ethnicity: 'white',
      phone: '123456',
      address: '12 Ginger Street',
      district: 'little_seoul',
      isOrganization: false,
      organizationName: undefined,
      anonymous: false,
      fleecaConfirmation: true,
    })
  })

  it('treats empty optionals as undefined or null', () => {
    const result = donationSchema.parse({
      ...validInput,
      firstname: 'Jean',
      age: '',
      ethnicity: '',
      phone: '',
      address: '',
      district: '',
    })

    expect(result.age).toBeUndefined()
    expect(result.phone).toBeUndefined()
    expect(result.address).toBeUndefined()
    expect(result.ethnicity).toBeNull()
    expect(result.district).toBeNull()
  })

  it('rejects a missing amount', () => {
    expect(() => donationSchema.parse({ ...validInput, amount: undefined })).toThrow()
  })

  it('rejects an amount below the minimum', () => {
    expect(() => donationSchema.parse({ ...validInput, amount: 199 })).toThrow(
      /Le montant minimum pour un don est de \$200/
    )
  })

  it('rejects an amount above the Fleeca maximum', () => {
    expect(() => donationSchema.parse({ ...validInput, amount: 100_000_000 })).toThrow(
      /Le montant maximum pour un don est de/
    )
  })

  it('rejects a non-integer amount', () => {
    expect(() => donationSchema.parse({ ...validInput, amount: 500.5 })).toThrow(
      'Le montant doit être un nombre entier valide.'
    )
  })

  it('rejects an empty name', () => {
    expect(() => donationSchema.parse({ ...validInput, firstname: '   ' })).toThrow(
      'Le prénom ne peut pas être vide.'
    )
  })

  it.each([
    ['15', "L'âge minimum pour faire un don est de 18 ans."],
    ['121', "L'âge ne peut pas dépasser 120 ans."],
    ['abc', "L'âge doit être un nombre entier."],
  ])('rejects an invalid age "%s"', (age, message) => {
    expect(() => donationSchema.parse({ ...validInput, age })).toThrow(message)
  })

  it('rejects a phone number with fewer than 3 digits', () => {
    expect(() => donationSchema.parse({ ...validInput, phone: '12' })).toThrow(
      'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects an address shorter than 10 characters', () => {
    expect(() => donationSchema.parse({ ...validInput, address: 'Ginger St' })).toThrow(
      "L'adresse doit contenir au minimum 10 caractères."
    )
  })

  it('requires a district when an address is provided', () => {
    expect(() => donationSchema.parse({ ...validInput, district: '' })).toThrow(
      "Le district est requis lorsqu'une adresse est indiquée."
    )
  })

  it('rejects an unknown district value', () => {
    expect(() => donationSchema.parse({ ...validInput, district: 'atlantis' })).toThrow(
      'Sélectionnez une réponse valide.'
    )
  })

  it('requires an organization name for an organization donation', () => {
    expect(() =>
      donationSchema.parse({ ...validInput, isOrganization: true, organizationName: '' })
    ).toThrow("Le nom de l'organisation est requis.")
  })

  it('rejects an unconfirmed Fleeca donation', () => {
    expect(() => donationSchema.parse({ ...validInput, fleecaConfirmation: false })).toThrow(
      'Vous devez cocher la confirmation pour continuer.'
    )
  })
})
