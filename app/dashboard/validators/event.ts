import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const createEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: vine.string().trim().minLength(10).maxLength(255),
    content: vine.string().trim().minLength(10),
    location: vine.string().trim().minLength(5),
    parishId: vine.number().nonNegative().optional(),
    coverImageUrl: vine.string().url().optional(),
    flyerUrl: vine.string().url().optional(),
    registrationRequired: vine
      .boolean()
      .optional()
      .transform((v) => Boolean(v)),
    maxParticipants: vine.number().positive().min(1).optional(),
    startDate: vine
      .date({ formats: { utc: true } })
      .after('today')
      .transform((v) => DateTime.fromJSDate(v)),
    endDate: vine
      .date({ formats: { utc: true } })
      .afterField('startDate')
      .optional()
      .transform((v) => DateTime.fromJSDate(v)),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(3).maxLength(255).optional(),
    slug: vine
      .string()
      .trim()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    description: vine.string().trim().minLength(10).maxLength(255).optional(),
    content: vine.string().trim().minLength(10).optional(),
    location: vine.string().trim().minLength(5).optional(),
    parishId: vine.number().nonNegative().optional(),
    coverImageUrl: vine.string().url().optional(),
    flyerUrl: vine.string().url().optional(),
    registrationRequired: vine
      .boolean()
      .optional()
      .transform((v) => Boolean(v)),
    maxParticipants: vine.number().positive().min(1).optional(),
    startDate: vine
      .date({ formats: { utc: true } })
      .after('today')
      .optional()
      .transform((v) => DateTime.fromJSDate(v)),
    endDate: vine
      .date({ formats: { utc: true } })
      .afterField('startDate')
      .optional()
      .transform((v) => DateTime.fromJSDate(v)),
  })
)
