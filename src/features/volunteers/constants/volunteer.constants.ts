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

export const [SPOKEN_LANGUAGE, SPOKEN_LANGUAGE_VALUES] = createEnum({
  SPANISH: 'spanish',
  FRENCH: 'french',
  PORTUGUESE: 'portuguese',
  ITALIAN: 'italian',
  LATIN: 'latin',
  VIETNAMESE: 'vietnamese',
  TAGALOG: 'tagalog',
  POLISH: 'polish',
  GERMAN: 'german',
  KOREAN: 'korean',
  CHINESE: 'chinese',
  OTHER: 'other',
})

export const spokenLanguageLabels = Object.freeze({
  [SPOKEN_LANGUAGE.SPANISH]: 'Espagnol',
  [SPOKEN_LANGUAGE.FRENCH]: 'Français',
  [SPOKEN_LANGUAGE.PORTUGUESE]: 'Portugais',
  [SPOKEN_LANGUAGE.ITALIAN]: 'Italien',
  [SPOKEN_LANGUAGE.LATIN]: 'Latin',
  [SPOKEN_LANGUAGE.VIETNAMESE]: 'Vietnamien',
  [SPOKEN_LANGUAGE.TAGALOG]: 'Tagalog (Filipino)',
  [SPOKEN_LANGUAGE.POLISH]: 'Polonais',
  [SPOKEN_LANGUAGE.GERMAN]: 'Allemand',
  [SPOKEN_LANGUAGE.KOREAN]: 'Coréen',
  [SPOKEN_LANGUAGE.CHINESE]: 'Chinois (mandarin)',
  [SPOKEN_LANGUAGE.OTHER]: 'Autre',
})

export const spokenLanguageOptions = SPOKEN_LANGUAGE_VALUES.map((value) => ({
  value,
  label: spokenLanguageLabels[value],
}))

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
