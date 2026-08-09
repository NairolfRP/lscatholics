import { describe, expect, it } from 'vitest'
import { parishionerSchema } from '#/features/parishioner/schemas/parishioner.schema.ts'

const validInput = {
  civilTitle: 'mr',
  maritalStatus: 'single',
  firstname: ' Jean ',
  lastname: 'Valjean',
  gender: 'male',
  age: '30',
  ethnicCommunity: '',
  occupation: '',
  phone: '12345678',
  emergencyPhone: '',
  address: '12 Ginger Street',
  district: 'little_seoul',
  baptized: 'yes',
  religion: '',
  parish: 'cathedral',
  isVolunteer: false,
  familyMembers: [],
  message: '',
  characterSacraments: [],
  oocAdditionalInformation: '',
}

describe('parishionerSchema', () => {
  it('parses a valid registration and normalizes the output', () => {
    const result = parishionerSchema.parse(validInput)

    expect(result).toEqual({
      civilTitle: 'mr',
      maritalStatus: 'single',
      firstname: 'Jean',
      lastname: 'Valjean',
      gender: 'male',
      age: 30,
      ethnicCommunity: undefined,
      occupation: '',
      phone: '12345678',
      emergencyPhone: undefined,
      address: '12 Ginger Street',
      district: 'little_seoul',
      baptized: 'yes',
      religion: undefined,
      parish: 'cathedral',
      isVolunteer: false,
      familyMembers: [],
      message: '',
      characterSacraments: [],
      oocAdditionalInformation: '',
    })
  })

  it('rejects a missing civil title', () => {
    expect(() => parishionerSchema.parse({ ...validInput, civilTitle: undefined })).toThrow(
      'Le titre de civilité est requis.'
    )
  })

  it('rejects an invalid civil title', () => {
    expect(() => parishionerSchema.parse({ ...validInput, civilTitle: 'king' })).toThrow(
      'Titre de civilité invalide.'
    )
  })

  it('rejects a missing gender', () => {
    expect(() => parishionerSchema.parse({ ...validInput, gender: undefined })).toThrow(
      'Le sexe est requis.'
    )
  })

  it('rejects an invalid age', () => {
    expect(() => parishionerSchema.parse({ ...validInput, age: '17' })).toThrow(
      "L'âge minimum pour s'enregistrer est de 18 ans."
    )
    expect(() => parishionerSchema.parse({ ...validInput, age: 'abc' })).toThrow(
      'Veuillez saisir un âge valide.'
    )
  })

  it('rejects a short address', () => {
    expect(() => parishionerSchema.parse({ ...validInput, address: 'Ginger St' })).toThrow(
      "L'adresse doit contenir au minimum 10 caractères."
    )
  })

  it('rejects a missing district', () => {
    expect(() => parishionerSchema.parse({ ...validInput, district: undefined })).toThrow(
      'Le quartier est requis.'
    )
  })

  it('rejects an unknown district', () => {
    expect(() => parishionerSchema.parse({ ...validInput, district: 'atlantis' })).toThrow(
      'Sélectionnez un quartier valide.'
    )
  })

  it('rejects a missing phone number', () => {
    expect(() => parishionerSchema.parse({ ...validInput, phone: undefined })).toThrow(
      'Le numéro de téléphone est requis.'
    )
  })

  it('rejects a missing baptism status', () => {
    expect(() => parishionerSchema.parse({ ...validInput, baptized: undefined })).toThrow(
      'Veuillez indiquer si vous êtes baptisé.'
    )
  })

  it('rejects an invalid parish', () => {
    expect(() => parishionerSchema.parse({ ...validInput, parish: 'narnia' })).toThrow(
      'Paroisse invalide.'
    )
  })

  it('rejects an occupation longer than 20 characters', () => {
    expect(() => parishionerSchema.parse({ ...validInput, occupation: 'a'.repeat(21) })).toThrow(
      "L'activité ne peut pas dépasser 20 caractères."
    )
  })

  it('rejects a message longer than 300 characters', () => {
    expect(() => parishionerSchema.parse({ ...validInput, message: 'a'.repeat(301) })).toThrow(
      /ne doit pas faire plus de 300 caractères/
    )
  })

  it('rejects additional information longer than 700 characters', () => {
    expect(() =>
      parishionerSchema.parse({ ...validInput, oocAdditionalInformation: 'a'.repeat(701) })
    ).toThrow(/Ne dépassez pas 700 caractères/)
  })

  it('parses a family member and normalizes it', () => {
    const result = parishionerSchema.parse({
      ...validInput,
      familyMembers: [
        { firstname: ' Cosette ', lastname: 'Fauchelevent', age: '9', role: 'daughter' },
      ],
    })

    expect(result.familyMembers).toEqual([
      { firstname: 'Cosette', lastname: 'Fauchelevent', age: 9, role: 'daughter', isNpc: false },
    ])
  })

  it('rejects a family member without an age', () => {
    expect(() =>
      parishionerSchema.parse({
        ...validInput,
        familyMembers: [{ firstname: 'Cosette', lastname: 'Fauchelevent', role: 'daughter' }],
      })
    ).toThrow("Veuillez saisir l'âge de ce membre du foyer.")
  })

  it('rejects more than 5 family members', () => {
    expect(() =>
      parishionerSchema.parse({
        ...validInput,
        familyMembers: Array.from({ length: 6 }, () => ({
          firstname: 'Cosette',
          lastname: 'Fauchelevent',
          age: '9',
          role: 'daughter',
        })),
      })
    ).toThrow('Vous ne pouvez pas ajouter plus de 5 membres du foyer.')
  })

  it('rejects sacraments received without their prerequisites', () => {
    expect(() =>
      parishionerSchema.parse({ ...validInput, characterSacraments: ['confirmation'] })
    ).toThrow(
      "Le sacrement « confirmation » suppose d'avoir d'abord reçu d'autres sacrements. Vérifiez votre sélection."
    )
  })

  it('accepts sacraments whose prerequisites are also received', () => {
    const result = parishionerSchema.parse({
      ...validInput,
      characterSacraments: ['baptism', 'first_communion', 'confirmation'],
    })
    expect(result.characterSacraments).toEqual(['baptism', 'first_communion', 'confirmation'])
  })
})
