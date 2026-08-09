import { describe, expect, it } from 'vitest'
import { volunteerApplicationSchema } from '#/features/volunteers/schemas/volunteer-application.schema.ts'

const validInput = {
  firstname: ' Jean ',
  lastname: 'Valjean',
  middleName: '',
  age: '30',
  address: '12 Ginger Street',
  district: 'little_seoul',
  phone: '12345678',
  emergencyPhone: '',
  interestedActivities: '',
  otherLanguages: [],
  ethnicity: null,
  applicantSource: { type: null, employeeReferral: '' },
  volunteerAvailability: '',
  requiredHours: { reason: null, deadline: '' },
}

describe('volunteerApplicationSchema', () => {
  it('parses a valid application and normalizes the output', () => {
    const result = volunteerApplicationSchema.parse(validInput)

    expect(result).toEqual({
      firstname: 'Jean',
      lastname: 'Valjean',
      middleName: undefined,
      age: 30,
      address: '12 Ginger Street',
      district: 'little_seoul',
      phone: '12345678',
      emergencyPhone: undefined,
      interestedActivities: undefined,
      otherLanguages: [],
      ethnicity: null,
      applicantSource: { type: null, employeeReferral: undefined },
      volunteerAvailability: undefined,
      requiredHours: { reason: null, deadline: undefined },
    })
  })

  it('rejects a missing firstname', () => {
    expect(() => volunteerApplicationSchema.parse({ ...validInput, firstname: undefined })).toThrow(
      'Le prénom est requis.'
    )
  })

  it('rejects an invalid age', () => {
    expect(() => volunteerApplicationSchema.parse({ ...validInput, age: '17' })).toThrow(
      "L'âge minimum pour devenir bénévole est de 18 ans."
    )
    expect(() => volunteerApplicationSchema.parse({ ...validInput, age: '121' })).toThrow(
      "L'âge ne peut pas dépasser 120 ans."
    )
  })

  it('rejects a short address', () => {
    expect(() => volunteerApplicationSchema.parse({ ...validInput, address: 'Ginger St' })).toThrow(
      "L'adresse doit contenir au minimum 10 caractères."
    )
  })

  it('rejects an unknown district', () => {
    expect(() => volunteerApplicationSchema.parse({ ...validInput, district: 'atlantis' })).toThrow(
      'Sélectionnez un quartier valide.'
    )
  })

  it('rejects an invalid phone number', () => {
    expect(() => volunteerApplicationSchema.parse({ ...validInput, phone: '12' })).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects an invalid other language', () => {
    expect(() =>
      volunteerApplicationSchema.parse({ ...validInput, otherLanguages: ['klingon'] })
    ).toThrow('Réponse invalide.')
  })

  it('rejects an unknown ethnicity', () => {
    expect(() =>
      volunteerApplicationSchema.parse({ ...validInput, ethnicity: 'atlantean' })
    ).toThrow('Réponse invalide.')
  })

  it('requires a referral name for an employee referral', () => {
    expect(() =>
      volunteerApplicationSchema.parse({
        ...validInput,
        applicantSource: { type: 'employeeReferral', employeeReferral: '' },
      })
    ).toThrow("Le nom de l'employé référent est requis.")
  })

  it('requires a deadline when a required hours reason is provided', () => {
    expect(() =>
      volunteerApplicationSchema.parse({
        ...validInput,
        requiredHours: { reason: 'religious-education', deadline: '' },
      })
    ).toThrow("La date d'échéance est requise.")
  })
})
