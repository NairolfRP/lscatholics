import type {
  VolunteerApplicationInput,
} from '#/features/volunteers/schemas/volunteer-application.schema.ts'
import type { Character } from '#shared/types/character.types.ts'

export function getVolunteerDefaults(currentCharacter: Character | null | undefined) {
  return {
    firstname: currentCharacter?.firstname ?? '',
    middleName: '',
    lastname: currentCharacter?.lastname ?? '',
    age: '',
    address: '',
    district: '',
    phone: '',
    emergencyPhone: '',
    interestedActivities: '',
    otherLanguages: [],
    ethnicity: null,
    applicantSource: {
      type: null,
      employeeReferral: '',
    },
    volunteerAvailability: '',
    requiredHours: {
      reason: null,
      deadline: '',
    },
  } as unknown as VolunteerApplicationInput
}
