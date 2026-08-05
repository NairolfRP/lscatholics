import type { INDIVIDUAL_SACRAMENT } from '#/features/parishioner/constants/person.constants'

export type IndividualSacrament = (typeof INDIVIDUAL_SACRAMENT)[keyof typeof INDIVIDUAL_SACRAMENT]
