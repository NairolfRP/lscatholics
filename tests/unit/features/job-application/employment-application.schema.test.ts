import { describe, expect, it } from 'vitest'
import { employmentApplicationSchema } from '#/features/job-application/schemas/employment-application.schema.ts'

const validInput = {
  firstname: ' Jean ',
  lastname: 'Valjean',
  middleName: '',
  age: '30',
  gender: 'male',
  district: 'little_seoul',
  address: '12 Ginger Street',
  phone: '12345678',
  isPracticingCatholic: true,
  hasDriverLicense: false,
  applicationSource: { type: null, employeeReferral: '' },
  education: { highestLevel: 'highSchoolDiploma', fieldOfStudy: '' },
  spokenLanguages: [],
  professionalExperience: [],
  applicantDeclarationAccepted: true,
  discordUsername: 'jean.valjean',
  motivationsOOC: '',
}

describe('employmentApplicationSchema', () => {
  it('parses a valid application and normalizes the output', () => {
    const result = employmentApplicationSchema.parse(validInput)

    expect(result).toEqual({
      firstname: 'Jean',
      lastname: 'Valjean',
      middleName: '',
      age: 30,
      gender: 'male',
      district: 'little_seoul',
      address: '12 Ginger Street',
      phone: '12345678',
      isPracticingCatholic: true,
      hasDriverLicense: false,
      applicationSource: { type: undefined, employeeReferral: '' },
      education: { highestLevel: 'highSchoolDiploma', fieldOfStudy: '' },
      spokenLanguages: [],
      professionalExperience: [],
      applicantDeclarationAccepted: true,
      discordUsername: 'jean.valjean',
      motivationsOOC: undefined,
    })
  })

  it('rejects an applicant under 18', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, age: '17' })).toThrow(
      "Vous devez être âgé d'au moins 18 ans."
    )
  })

  it('rejects an applicant over 115', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, age: '116' })).toThrow(
      'Vous ne pouvez pas être âgé de plus de 115 ans.'
    )
  })

  it('rejects a missing gender', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, gender: undefined })).toThrow(
      'Veuillez indiquer votre genre.'
    )
  })

  it('rejects an invalid gender', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, gender: 'x' })).toThrow(
      'Réponse invalide.'
    )
  })

  it('rejects a missing district', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, district: undefined })).toThrow(
      'Le district est requis.'
    )
  })

  it('rejects an unknown district', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, district: 'atlantis' })).toThrow(
      'Sélectionnez un district valide.'
    )
  })

  it('rejects a missing firstname', () => {
    expect(() =>
      employmentApplicationSchema.parse({ ...validInput, firstname: undefined })
    ).toThrow('Le prénom est requis.')
  })

  it('rejects an invalid phone number', () => {
    expect(() => employmentApplicationSchema.parse({ ...validInput, phone: '12' })).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects an unanswered mandatory question', () => {
    expect(() =>
      employmentApplicationSchema.parse({ ...validInput, isPracticingCatholic: undefined })
    ).toThrow('Cette question est requise.')
  })

  it('rejects an unaccepted declaration', () => {
    expect(() =>
      employmentApplicationSchema.parse({ ...validInput, applicantDeclarationAccepted: false })
    ).toThrow('Vous devez comprendre et accepter la déclaration pour postuler.')
  })

  it('requires a referral name for an employee referral', () => {
    expect(() =>
      employmentApplicationSchema.parse({
        ...validInput,
        applicationSource: { type: 'employeeReferral', employeeReferral: '' },
      })
    ).toThrow("Le nom de l'employé référent est requis.")
  })

  it('requires a field of study when the school level demands one', () => {
    expect(() =>
      employmentApplicationSchema.parse({
        ...validInput,
        education: { highestLevel: 'someCollege', fieldOfStudy: '' },
      })
    ).toThrow("Vous devez préciser le domaine d'études.")
  })

  it('rejects an invalid discord username', () => {
    expect(() =>
      employmentApplicationSchema.parse({ ...validInput, discordUsername: 'Jean' })
    ).toThrow(
      "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage."
    )
  })

  it('parses a current professional experience and trims its fields', () => {
    const result = employmentApplicationSchema.parse({
      ...validInput,
      professionalExperience: [
        {
          isCurrentPosition: true,
          companyName: ' Los Santos Transport ',
          position: ' Driver ',
          startDate: '2020-01',
        },
      ],
    })

    expect(result.professionalExperience).toEqual([
      { isCurrentPosition: true, companyName: 'Los Santos Transport', position: 'Driver', startDate: '2020-01' },
    ])
  })

  it('rejects a past experience ending before it started', () => {
    expect(() =>
      employmentApplicationSchema.parse({
        ...validInput,
        professionalExperience: [
          {
            isCurrentPosition: false,
            companyName: 'Los Santos Transport',
            position: 'Driver',
            startDate: '2020-01',
            endDate: '2019-12',
            reasonForLeaving: 'Moved away',
          },
        ],
      })
    ).toThrow('La date de fin doit être postérieure à la date de début.')
  })

  it('rejects more than 3 professional experiences', () => {
    expect(() =>
      employmentApplicationSchema.parse({
        ...validInput,
        professionalExperience: Array.from({ length: 4 }, () => ({
          isCurrentPosition: true,
          companyName: 'Los Santos Transport',
          position: 'Driver',
          startDate: '2020-01',
        })),
      })
    ).toThrow('Vous ne pouvez pas ajouter plus de 3 expériences professionnelles.')
  })
})
