import type { z } from 'zod'
import type { employmentApplicationSchema } from '@/features/employment-application/schemas/employment_application.schema'

export type EmploymentApplicationFormValues = z.Infer<typeof employmentApplicationSchema>
