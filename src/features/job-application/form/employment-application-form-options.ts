import { formOptions } from '@tanstack/react-form'
import type { EmploymentApplicationInput } from '#/features/job-application/schemas/employment-application.schema.ts'

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
  } as unknown as EmploymentApplicationInput,
})
