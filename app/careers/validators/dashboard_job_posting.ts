import vine from '@vinejs/vine'
import { getEmploymentTypes } from '#shared/constants/employment.constants'
import JobPosting from '#careers/models/job_posting'

export const createDashboardJobPostingValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .minLength(3)
      .maxLength(255)
      .unique({ table: 'job_postings', column: 'slug' }),
    summary: vine.string().trim().minLength(10).maxLength(1500).optional(),
    reportsTo: vine.string().trim().minLength(3),
    department: vine.string(),
    responsibilities: vine.array(vine.string().trim().minLength(1)).minLength(1),
    requirements: vine.array(vine.string().trim().minLength(1)).optional(),
    skills: vine.array(vine.string().trim().minLength(1)).optional(),
    salary: vine.number().withoutDecimals().nonNegative(),
    employmentType: vine.enum(getEmploymentTypes),
    isActive: vine.boolean(),
    postedAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional(),
    expiresAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional(),
  })
)

export const updatedDashboardJobPostingValidator = ({ currentSlug }: { currentSlug: string }) => {
  return vine.create(
    vine.object({
      title: vine.string().trim().minLength(3).maxLength(255).optional(),
      slug: vine
        .string()
        .trim()
        .regex(/^[a-z0-9-]+$/)
        .minLength(3)
        .maxLength(255)
        .unique(async (_, value) => {
          if (value === currentSlug) return true

          const row = await JobPosting.findBy('slug', value)
          return !row
        })
        .optional(),
      summary: vine.string().trim().minLength(10).maxLength(1500).optional(),
      reportsTo: vine.string().trim().minLength(3).optional(),
      department: vine.string().optional(),
      responsibilities: vine.array(vine.string().trim().minLength(1)).minLength(1).optional(),
      requirements: vine.array(vine.string().trim().minLength(1)).optional(),
      skills: vine.array(vine.string().trim().minLength(1)).optional(),
      salary: vine.number().withoutDecimals().nonNegative().optional(),
      employmentType: vine.enum(getEmploymentTypes).optional(),
      isActive: vine.boolean().optional(),
      postedAt: vine
        .date({ formats: { utc: true } })
        .nullable()
        .optional(),
      expiresAt: vine
        .date({ formats: { utc: true } })
        .nullable()
        .optional(),
    })
  )
}
