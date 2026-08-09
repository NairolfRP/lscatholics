import { createEnum } from '#shared/lib/enum.ts'

export {
  APPLICATION_SOURCE,
  APPLICATION_SOURCE_VALUES,
  applicationSourceLabels,
  applicationSourceOptions,
} from '#shared/constants/application-source.ts'
export {
  SPOKEN_LANGUAGE,
  SPOKEN_LANGUAGE_VALUES,
  spokenLanguageLabels,
  spokenLanguageOptions,
} from '#shared/constants/languages.ts'

export const [REQUIRED_HOURS_REASON, REQUIRED_HOURS_REASON_VALUES] = createEnum({
  RELIGIOUS_EDUCATION: 'religious-education',
  COURT_ORDERED: 'court-ordered',
  HIGH_SCHOOL: 'high-school',
  UNIVERSITY: 'university',
  OTHER: 'other',
})

export const requiredHoursReasonLabels = Object.freeze({
  [REQUIRED_HOURS_REASON.RELIGIOUS_EDUCATION]: 'Enseignement religieux (ex. : catéchisme)',
  [REQUIRED_HOURS_REASON.COURT_ORDERED]: "Travaux d'intérêt général ordonnés par le tribunal",
  [REQUIRED_HOURS_REASON.HIGH_SCHOOL]: 'Conditions requises par le lycée',
  [REQUIRED_HOURS_REASON.UNIVERSITY]: 'Conditions requises par le College / Université',
  [REQUIRED_HOURS_REASON.OTHER]: 'Autre',
})

export const requiredHoursReasonOptions = REQUIRED_HOURS_REASON_VALUES.map((value) => ({
  value,
  label: requiredHoursReasonLabels[value],
}))

export const APPLICATION_MAX_LENGTHS = Object.freeze({
  FIRSTNAME: 50,
  MIDDLE_NAME: 50,
  LASTNAME: 50,
  ADDRESS: 60,
  PHONE: 8,
  INTERESTED_ACTIVITIES: 250,
  AVAILABILITY: 250,
  EMPLOYEE_REFERRAL: 100,
  DEADLINE: 50,
  MIN_AGE: 18,
  MAX_AGE: 120,
} as const)
