import type { EMPLOYMENT_TYPE } from '#shared/constants/employment.ts'

export type EmploymentType = (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE]
