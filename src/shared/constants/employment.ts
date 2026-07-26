import { createEnum } from '#shared/lib/enum.ts'

export const [EMPLOYMENT_TYPE, EMPLOYMENT_TYPE_VALUES] = createEnum({
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  TEMPORARY: 'temporary',
  OCCASIONAL: 'occasional',
})

export const employmentTypeLabel = Object.freeze({
  [EMPLOYMENT_TYPE.FULL_TIME]: 'Temps plein',
  [EMPLOYMENT_TYPE.PART_TIME]: 'Temps partiel',
  [EMPLOYMENT_TYPE.CONTRACT]: 'Contractuel',
  [EMPLOYMENT_TYPE.INTERNSHIP]: 'Stage',
  [EMPLOYMENT_TYPE.TEMPORARY]: 'Temporaire',
  [EMPLOYMENT_TYPE.OCCASIONAL]: 'Occasionnel',
})
