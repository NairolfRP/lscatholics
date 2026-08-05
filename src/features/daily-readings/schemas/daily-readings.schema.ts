import { format } from 'date-fns'
import { z } from 'zod'

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function todayISODate(): string {
  return toISODate(new Date())
}

// --- AELF.org API payload validation ---

const aelfReadingSchema = z.object({
  type: z.string(),
  refrain_psalmique: z.string().nullable(),
  ref_refrain: z.string().nullable(),
  titre: z.string().nullable(),
  contenu: z.string(),
  ref: z.string(),
  intro_lue: z.string().nullable(),
  verset_evangile: z.string().nullable(),
  ref_verset: z.string().nullable(),
})

const aelfMassSchema = z.object({
  nom: z.string(),
  lectures: z.array(aelfReadingSchema),
})

/** AELF sends `null` for an absent secondary color; normalize it to an empty string. */
const aelfColorSchema = z
  .string()
  .nullish()
  .transform((value) => value ?? '')

export const aelfReadingsResponseSchema = z.object({
  informations: z.object({
    date: z.string(),
    zone: z.string(),
    couleur: z.string(),
    annee: z.string().nullable(),
    temps_liturgique: z.string().nullable(),
    semaine: z.string().nullable(),
    jour: z.string().nullable(),
    jour_liturgique_nom: z.string(),
    fete: z.string(),
    degre: z.string(),
    ligne1: z.string(),
    ligne2: z.string(),
    ligne3: z.string(),
    couleur2: aelfColorSchema,
    couleur3: aelfColorSchema,
  }),
  messes: z.array(aelfMassSchema),
})
