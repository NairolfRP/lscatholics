import { createEnum } from '#shared/lib/enum.ts'

export const [CLERGY_ROLE, CLERGY_ROLE_VALUES] = createEnum({
  DEACON_PERMANENT: 'deacon-permanent',
  DEACON_TEMPORARY: 'deacon-temporary',
  PRIEST: 'priest',
})

export type ClergyRole = (typeof CLERGY_ROLE_VALUES)[number]

export const [CLERGY_MARITAL_STATUS, CLERGY_MARITAL_STATUS_VALUES] = createEnum({
  SINGLE: 'single',
  MARRIED: 'married',
})

export const clergyMaritalStatusLabels = Object.freeze({
  [CLERGY_MARITAL_STATUS.SINGLE]: 'Célibataire',
  [CLERGY_MARITAL_STATUS.MARRIED]: 'Marié(e)',
})

export const clergyMaritalStatusOptions = CLERGY_MARITAL_STATUS_VALUES.map((value) => ({
  value,
  label: clergyMaritalStatusLabels[value],
}))

export const clergyRoleLabels = Object.freeze({
  [CLERGY_ROLE.DEACON_PERMANENT]: 'Diacre permanent',
  [CLERGY_ROLE.DEACON_TEMPORARY]:
    "Diacre temporaire (le personnage sera ordonné prêtre d'ici quelques temps)",
  [CLERGY_ROLE.PRIEST]: 'Prêtre diocésain',
})

export const clergyRoleOptions = CLERGY_ROLE_VALUES.map((value) => ({
  value,
  label: clergyRoleLabels[value],
}))

export const CLERGY_APPLICATION_MAX_LENGTHS = Object.freeze({
  DISCORD_USERNAME: 32,
  SANCTIONS: 100,
  CHARACTER_STORY: 3500,
  MOTIVATIONS: 2000,
  MIN_PRIEST_AGE: 25,
  MAX_PRIEST_AGE: 55,
  MIN_TEMPORARY_DEACON_AGE: 23,
  MAX_TEMPORARY_DEACON_AGE: 55,
  MIN_UNMARRIED_PERMANENT_DEACON_AGE: 25,
  MIN_MARRIED_PERMANENT_DEACON_AGE: 35,
} as const)

export const CLERGY_APPLICATION_MIN_LENGTHS = Object.freeze({
  CHARACTER_STORY: 150,
  MOTIVATIONS: 50,
})

export const clergyApplicationDiscordThreadTag = Object.freeze({
  [CLERGY_ROLE.PRIEST]: '1537100606676795433',
  [CLERGY_ROLE.DEACON_TEMPORARY]: '1537100782074204210',
  [CLERGY_ROLE.DEACON_PERMANENT]: '1537100988849324162',
})

export const CLERGY_APPLICATION_DISCORD_PENDING_THREAD_TAG = '1537103427459612692'
