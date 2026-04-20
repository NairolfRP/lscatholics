import { formOptions, type StandardSchemaV1 } from '@tanstack/react-form'
import {
  type VolunteerApplication,
  volunteerApplicationSchema,
} from '@/features/volunteers/schemas/volunteer_application.schema'

export const volunteersFormOpts = (firstname: string = '', lastname: string = '') => {
  return formOptions({
    validators: {
      onChange: volunteerApplicationSchema as unknown as StandardSchemaV1<VolunteerApplication>,
    },
    defaultValues: {
      firstname,
      middleName: '',
      lastname,
      address: '',
      district: '',
      phone: '',
      age: undefined,
      emergencyPhone: '',

      interestedActivities: '',
      otherLanguages: [],
      ethnicity: undefined,

      applicantSource: {
        type: undefined,
        employeeReferral: '',
      },

      volunteerAvailability: '',

      requiredHours: {
        reason: undefined,
        deadline: undefined,
      },
    } as unknown as VolunteerApplication,
  })
}
