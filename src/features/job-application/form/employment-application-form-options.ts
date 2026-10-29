import { formOptions } from '@tanstack/react-form'
import type { EmploymentApplicationInput } from '#/features/job-application/schemas/employment-application.schema.ts'
import type { CharacterWithFaction } from '#shared/types/character.types.ts'

export const employmentApplicationFormOptions = formOptions({
  formId: 'employment-application-submission-form',
  defaultValues: {
    firstname: '',
    lastname: '',
    middleName: '',
    age: '',
    gender: undefined,
    district: '',
    address: '',
    phone: '',
    eyefindMail: '',
    iban: '',
    isPracticingCatholic: undefined,
    hasDriverLicense: undefined,
    applicationSource: {
      type: undefined,
      employeeReferral: '',
    },
    education: {
      highestLevel: undefined,
      fieldOfStudy: '',
    },
    spokenLanguages: [],
    professionalExperience: [],
    applicantDeclarationAccepted: undefined,
    discordUsername: '',
    motivationsOOC: '',
    desiredPosition: '',
  } as unknown as EmploymentApplicationInput,
})

export function createEmploymentApplicationDefaultValues(
  currentCharacter: CharacterWithFaction | null | undefined
): EmploymentApplicationInput {
  return {
    ...employmentApplicationFormOptions.defaultValues,
    firstname: currentCharacter?.firstname ?? '',
    lastname: currentCharacter?.lastname ?? '',
    iban: currentCharacter?.bankRoutingNumber ?? '',
  }
}
