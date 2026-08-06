import type {
  EmploymentApplicationInput,
} from '#/features/job-application/schemas/employment-application.schema.ts'
import type { Character } from '#shared/types/character.types.ts'

export function getEmploymentApplicationDefaults(currentCharacter: Character | null | undefined) {
  return {
    firstname: currentCharacter?.firstname ?? '',
    lastname: currentCharacter?.lastname ?? '',
    middleName: '',
    age: '',
    gender: undefined,
    district: '',
    address: '',
    phone: '',
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
  } as unknown as EmploymentApplicationInput
}
