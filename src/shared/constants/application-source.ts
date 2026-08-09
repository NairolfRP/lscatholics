import { createEnum } from '#shared/lib/enum.ts'

export const [APPLICATION_SOURCE, APPLICATION_SOURCE_VALUES] = createEnum({
  EMPLOYEE_REFERRAL: 'employeeReferral',
  PRESS: 'press',
  WEBSITE: 'website',
  INTERNET: 'internet',
  SOCIAL_MEDIA: 'socialMedia',
  JOB_FAIR: 'jobFair',
  OTHER: 'other',
})

export const applicationSourceLabels = Object.freeze({
  [APPLICATION_SOURCE.EMPLOYEE_REFERRAL]: "Par un employé de l'Archidiocèse",
  [APPLICATION_SOURCE.PRESS]: 'Presse / Médias',
  [APPLICATION_SOURCE.WEBSITE]: "Site web de l'Archidiocèse",
  [APPLICATION_SOURCE.INTERNET]: 'Internet',
  [APPLICATION_SOURCE.SOCIAL_MEDIA]: 'Facebrowser',
  [APPLICATION_SOURCE.JOB_FAIR]: "Salon de l'emploi",
  [APPLICATION_SOURCE.OTHER]: 'Autre',
})

export const applicationSourceOptions = APPLICATION_SOURCE_VALUES.map((value) => ({
  value,
  label: applicationSourceLabels[value],
}))
