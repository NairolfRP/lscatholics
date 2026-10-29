import { z } from 'zod'

export const incidentReportSchema = z.object({
  identity: z
    .string({ error: 'L’identité est requise.' })
    .trim()
    .min(2, { error: (iss) => `L’identité doit comporter au moins ${iss.minimum} caractères.` })
    .max(120, { error: (iss) => `L’identité ne doit pas dépasser ${iss.maximum} caractères.` }),
  position: z
    .string({ error: 'Le poste est requis.' })
    .trim()
    .min(2, { error: (iss) => `Le poste doit comporter au moins ${iss.minimum} caractères.` })
    .max(120, { error: (iss) => `Le poste ne doit pas dépasser ${iss.maximum} caractères.` }),
  incidentAt: z
    .date({
      error: (iss) =>
        iss.input === undefined
          ? 'La date et l’heure de l’incident sont requises.'
          : 'Entrez une date et une heure valides.',
    })
    .refine((date) => date.getTime() <= Date.now(), {
      error: 'La date et l’heure de l’incident ne peuvent pas être dans le futur.',
    }),
  location: z
    .string({ error: 'Le lieu de l’incident est requis.' })
    .trim()
    .min(3, { error: (iss) => `Le lieu doit comporter au moins ${iss.minimum} caractères.` })
    .max(200, { error: (iss) => `Le lieu ne doit pas dépasser ${iss.maximum} caractères.` }),
  nature: z
    .string({ error: 'La nature de l’incident est requise.' })
    .trim()
    .min(3, { error: (iss) => `La nature doit comporter au moins ${iss.minimum} caractères.` })
    .max(200, { error: (iss) => `La nature ne doit pas dépasser ${iss.maximum} caractères.` }),
  witnesses: z
    .string()
    .trim()
    .max(500, { error: (iss) => `Les témoins ne doivent pas dépasser ${iss.maximum} caractères.` })
    .optional()
    .transform((value) => (value ? value : undefined)),
  details: z
    .string({ error: 'Le détail de l’incident est requis.' })
    .trim()
    .min(20, { error: (iss) => `Le détail doit comporter au moins ${iss.minimum} caractères.` })
    .max(4000, { error: (iss) => `Le détail ne doit pas dépasser ${iss.maximum} caractères.` }),
})

export type IncidentReportFormInput = z.input<typeof incidentReportSchema>
export type IncidentReportFormOutput = z.output<typeof incidentReportSchema>
