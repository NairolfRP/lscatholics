import { z } from 'zod'
import { DEPARTMENT_VALUES } from '#shared/constants/department.ts'
import { EMPLOYMENT_TYPE_VALUES } from '#shared/constants/employment.ts'
import { slugSchema } from '#shared/schemas/slug.schema.ts'
import { pageSchema } from '#shared/schemas/pagination.schema.ts'
import { emptyToNull } from '#shared/schemas/utils.schema.ts'

export const jobPostingsSearchSchema = z.object({
  page: pageSchema,
  department: z
    .enum(DEPARTMENT_VALUES)
    .optional()
    .catch(() => undefined)
    .transform((dep) => (!dep || dep.trim() === '' ? undefined : dep)),
  search: z.coerce
    .string()
    .optional()
    .default('')
    .catch(() => ''),
  type: z.array(z.enum(EMPLOYMENT_TYPE_VALUES)).default([]).catch([]),
})

export const baseJobPostingInteractionSchema = z.object({ jobPostingId: z.uuidv4() })

export const editJobPostingSchema = z.object({
  title: z
    .string({
      error: (iss) => (iss.input === undefined ? 'Le titre est requis.' : 'Titre invalide.'),
    })
    .trim()
    .min(3, { error: (iss) => `Le titre doit comporter au moins ${iss.minimum} caractères.` })
    .max(150, { error: (iss) => `Le titre ne doit pas dépasser ${iss.maximum} caractères.` }),
  slug: slugSchema.optional(),
  description: emptyToNull(
    z
      .string({
        error: 'La description doit être du markdown ou des chaînes de caractères.',
      })
      .trim()
      .min(5, {
        error: (iss) => `La description doit comporter au moins ${iss.minimum} caractères.`,
      })
      .max(2000, {
        error: (iss) => `La description ne doit pas dépasser ${iss.maximum} caractères.`,
      })
  ),
  reportsTo: emptyToNull(
    z
      .string()
      .trim()
      .max(100, { error: (iss) => `Ce champs ne doit pas dépasser ${iss.maximum} caractères.` })
  ),
  department: z.enum(DEPARTMENT_VALUES, {
    error: (iss) =>
      iss.input === undefined
        ? 'Le département est requis.'
        : 'Ce département est invalide ou a été supprimé.',
  }),
  responsibilities: z
    .array(
      z
        .string()
        .trim()
        .min(3, {
          error: (iss) => `Une responsabilité doit faire au moins ${iss.minimum} caractères`,
        })
    )
    .min(1, { error: 'Vous devez ajouter au moins une responsabilité.' })
    .transform((values) => values.filter((v) => v))
    .default([]),
  requirements: z
    .array(
      z
        .string()
        .trim()
        .min(3, { error: (iss) => `Une condition doit faire au moins ${iss.minimum} caractères` })
    )
    .transform((values) => values.filter((v) => v))
    .optional()
    .default([]),
  skills: z
    .array(
      z
        .string()
        .trim()
        .min(3, { error: (iss) => `Une compétence doit faire au moins ${iss.minimum} caractères` })
    )
    .transform((values) => values.filter((v) => v))
    .optional()
    .default([]),
  salary: z
    .object({
      min: z.coerce
        .number({
          error: (iss) =>
            iss.input === undefined
              ? 'Le salaire minimum est requis.'
              : 'Le salaire minimum doit être un nombre.',
        })
        .int({ error: 'Le salaire minimum doit être un nombre entier.' })
        .positive({ error: 'Le salaire minimum doit être un nombre positif.' })
        .min(50, {
          error: (iss) => `Le salaire minimum doit être être supérieur ou égal à $${iss.minimum}.`,
        })
        .max(115000, {
          error: (iss) => `Le salaire minimum ne peut pas dépasser $${iss.maximum}.`,
        }),
      max: emptyToNull(
        z.coerce
          .number({
            error: 'Le salaire maximum doit être un nombre.',
          })
          .int({ error: 'Le salaire maximum doit être un nombre entier.' })
          .positive({ error: 'Le salaire maximum doit être un nombre positif.' })
          .min(50, {
            error: (iss) =>
              `Le salaire maximum doit être être supérieur ou égal à $${iss.minimum}.`,
          })
          .max(115000, {
            error: (iss) => `Le salaire maximum ne peut pas dépasser $${iss.maximum}.`,
          })
      ),
    })
    .superRefine((salary, ctx) => {
      if (salary.max && !salary.min) {
        ctx.addIssue({
          code: 'custom',
          message:
            'Vous ne pouvez pas indiquer un salaire maximum sans définir un salaire minimum.',
          path: ['max'],
          input: salary.max,
        })
      }

      if (salary.max != null && salary.max <= salary.min) {
        ctx.addIssue({
          code: 'custom',
          message: 'Le salaire maximum doit être supérieur au salaire minimum.',
          path: ['max'],
          input: salary.max,
        })
      }
    }),
  employmentType: z.enum(EMPLOYMENT_TYPE_VALUES, {
    error: (iss) => (iss.input === undefined ? "Le type d'emploi est requis." : 'Type invalide.'),
  }),
  isActive: z.boolean().default(true),
  postedAt: emptyToNull(z.date({ error: 'Entrez une date valide.' })),
  expiresAt: emptyToNull(z.date({ error: 'Entrez une date valide.' })),
})

export type EditJobPostingFormInput = z.input<typeof editJobPostingSchema>

export const createJobPostingSchema = editJobPostingSchema

export type CreateJobPostingFormInput = z.input<typeof createJobPostingSchema>
