export const EMPLOYMENT_TYPE = {
  full_time: 'Temps plein',
  part_time: 'Temps partiel',
  contract: 'Contrat',
  internship: 'Stage',
  temporary: 'Temporaire',
  occasional: 'Occasionnel',
} as const

export const getEmploymentTypes = Object.keys(EMPLOYMENT_TYPE)

export type EmploymentType = keyof typeof EMPLOYMENT_TYPE
