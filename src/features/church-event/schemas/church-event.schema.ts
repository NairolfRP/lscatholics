import { z } from 'zod'
import { formatDateTime } from '#/utils/date.ts'
import { PARISH_VALUES } from '#shared/constants/parish.ts'
import { slugSchema } from '#shared/schemas/common.schema.ts'
import { emptyToNull } from '#shared/schemas/utils.schema.ts'

export const baseChurchEventInteractionSchema = z.object({ churchEventId: z.cuid2() })

export const editChurchEventSchema = z
  .object({
    title: z
      .string({
        error: (iss) => (iss.input === undefined ? 'Le titre est requis.' : 'Titre invalide.'),
      })
      .trim()
      .min(3, { error: (iss) => `Le titre doit comporter au moins ${iss.minimum} caractères.` })
      .max(255, { error: (iss) => `Le titre ne doit pas dépasser ${iss.maximum} caractères.` }),
    slug: slugSchema.optional(),
    description: z
      .string({
        error: (iss) =>
          iss.input === undefined ? 'La description est requise.' : 'Description invalide.',
      })
      .trim()
      .min(5, {
        error: (iss) => `La description doit comporter au moins ${iss.minimum} caractères.`,
      })
      .max(250, {
        error: (iss) => `La description ne doit pas dépasser ${iss.maximum} caractères.`,
      }),
    content: z
      .string({
        error: (iss) => (iss.input === undefined ? 'Le contenu est requis.' : 'Contenu invalide.'),
      })
      .trim()
      .min(10, { error: (iss) => `Le contenu doit comporter au moins ${iss.minimum} caractères.` }),
    location: z
      .string({
        error: (iss) => (iss.input === undefined ? 'Le lieu est requis.' : 'Lieu invalide.'),
      })
      .trim()
      .min(3, { error: (iss) => `Le lieu doit contenir au moins ${iss.minimum} caractères.` })
      .max(200, { error: (iss) => `Le lieu ne doit pas dépasser ${iss.maximum} caractères.` }),
    parish: z.enum(PARISH_VALUES, { error: 'Sélectionnez une paroisse valide.' }).nullable(),
    coverImageUrl: z.url({
      error: (iss) =>
        iss.input === undefined
          ? "L'image de couverture est requise."
          : "L'image de couverture doit être une URL valide.",
    }),
    flyerUrl: emptyToNull(z.url({ error: "L'affiche doit être une URL valide." })),
    registrationRequired: z.boolean(),
    maxParticipants: emptyToNull(
      z
        .int({ error: 'Le nombre de participants doit être un entier.' })
        .positive({ error: 'Le nombre de participants doit être positif.' })
        .max(1000, {
          error: (iss) => `Le nombre de participants ne doit pas dépasser ${iss.maximum}.`,
        })
    ),
    startDate: z.date({
      error: (iss) =>
        iss.input === undefined ? 'La date de début est requise.' : 'Entrez une date valide.',
    }),
    endDate: emptyToNull(z.date({ error: 'Entrez une date valide.' })),
  })
  .refine(
    (data) => {
      // oxlint-disable-next-line typescript/no-unnecessary-condition
      if (!data.startDate || !data.endDate) {
        return true
      }

      return data.endDate > data.startDate
    },
    {
      error: 'La date de fin doit être après la date de début.',
      path: ['endDate'],
    }
  )

export const createChurchEventSchema = z
  .object({
    ...editChurchEventSchema.shape,
    startDate: z
      .date({
        error: (iss) =>
          iss.input === undefined ? 'La date de début est requise.' : 'Entrez une date valide.',
      })
      .min(new Date(Date.now() + 15 * 60 * 1000), {
        error: (iss) =>
          `La date de début doit être être égale ou supérieure au ${formatDateTime(new Date(iss.minimum as number))}.`,
      }),
  })
  .refine(
    (data) => {
      // oxlint-disable-next-line typescript/no-unnecessary-condition
      if (!data.startDate || !data.endDate) {
        return true
      }

      return data.endDate > data.startDate
    },
    {
      error: 'La date de fin doit être après la date de début.',
      path: ['endDate'],
    }
  )

export type InferEditChurchEventSchema = z.Infer<typeof editChurchEventSchema>
export type EditChurchEventFormInput = z.input<typeof editChurchEventSchema>
export type InferCreateChurchEventSchema = z.Infer<typeof createChurchEventSchema>
export type CreateChurchEventFormInput = z.input<typeof createChurchEventSchema>
