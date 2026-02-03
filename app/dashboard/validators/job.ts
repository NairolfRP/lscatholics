import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import { getEmploymentTypes } from '#shared/constants/employment.constants'

export const createJobValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    summary: vine.string().trim().minLength(10).maxLength(1500).optional(),
    reportsTo: vine.string().trim().minLength(3),
    department: vine.string(),
    responsibilities: vine.array(vine.string().trim().minLength(1)).minLength(1),
    requirements: vine.array(vine.string().trim().minLength(1)).optional(),
    salary: vine.number().withoutDecimals().nonNegative(),
    employmentType: vine.enum(getEmploymentTypes),
    isActive: vine.boolean(),
    postedAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional()
      .transform((v) => (v ? DateTime.fromJSDate(v) : null)),
    expiresAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional()
      .transform((v) => (v ? DateTime.fromJSDate(v) : null)),
  })
)

export const updatedJobValidator = vine.create(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    summary: vine.string().trim().minLength(10).maxLength(1500).optional(),
    reportsTo: vine.string().trim().minLength(3).optional(),
    department: vine.string().optional(),
    responsibilities: vine.array(vine.string().trim().minLength(1)).minLength(1).optional(),
    requirements: vine.array(vine.string().trim().minLength(1)).optional(),
    salary: vine.number().withoutDecimals().nonNegative().optional(),
    employmentType: vine.enum(getEmploymentTypes).optional(),
    isActive: vine.boolean().optional(),
    postedAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional()
      .transform((v) => (v ? DateTime.fromJSDate(v) : undefined)),
    expiresAt: vine
      .date({ formats: { utc: true } })
      .nullable()
      .optional()
      .transform((v) => (v ? DateTime.fromJSDate(v) : undefined)),
  })
)
