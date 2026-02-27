import { z } from 'zod'
import { getAllDepartmentsIDs } from '@/shared/constants/departments.constants'
import { getEmploymentTypes } from '#shared/constants/employment.constants'

export const createJobOfferSchema = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z
    .string()
    .trim()
    .slugify()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  summary: z.string().trim().min(10).max(1500).optional(),
  reportsTo: z.string().min(3),
  department: z.enum(getAllDepartmentsIDs()),
  responsibilities: z
    .array(z.string().trim())
    .transform((arr) => arr.filter((v) => v && v.length > 0))
    .pipe(z.array(z.string()).nonempty({ error: 'Au moins une ligne est requise' })),
  requirements: z
    .array(z.string().trim())
    .transform((arr) => arr.filter((v) => v && v.length > 0))
    .optional(),
  salary: z.int().nonnegative(),
  employmentType: z.enum(getEmploymentTypes),
  isActive: z.boolean(),
  postedAt: z.date(),
  expiresAt: z.date().optional(),
})

export type CreateJobOfferData = z.Infer<typeof createJobOfferSchema>
