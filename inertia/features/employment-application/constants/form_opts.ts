import { formOptions } from '@tanstack/react-form'
import { employmentApplicationSchema } from '@/features/employment-application/schemas/employment_application.schema'
import type { EmploymentApplicationFormValues } from '@/features/employment-application/types/employment_application'

export const employmentApplicationFormOpts = (firstname: string = '', lastname: string = '') => {
  return formOptions({
    validators: {
      onChange: employmentApplicationSchema,
    },
    defaultValues: {
      firstname: firstname ?? '',
      lastname: lastname ?? '',
      middleName: '',
      age: undefined,
      gender: undefined,
      district: undefined,
      address: '',
      phone: '',
      isPracticingCatholic: undefined,
      isLegalUSWorker: undefined,
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
      hasDriverLicense: undefined,
      applicantDeclaration: [],
      discordUsername: '',
      motivationsOOC: '',
    } as unknown as EmploymentApplicationFormValues,
  })
}
