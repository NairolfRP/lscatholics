import { createEnum } from '#shared/lib/enum.ts'

export const [DEPARTMENT, DEPARTMENT_VALUES] = createEnum({
  ARCHBISHOP: 'archbishop_office',
  MODERATOR: 'moderator_curia',
  CHANCELLOR: 'chancellor',
  SAFETY: 'safety',
  COM: 'communications',
  GENERAL_SERVICES: 'general_services',
  HR: 'human_resources',
  FINANCIAL: 'financial_services',
  COUNSEL: 'general_counsel',
  CHARITIES: 'charities',
})
