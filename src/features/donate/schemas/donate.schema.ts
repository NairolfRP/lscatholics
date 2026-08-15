import { z } from 'zod'
import {
  DONATION_MIN_AMOUNT,
  FLEECA_MAX_AMOUNT,
} from '#/features/donate/constants/donate.constants.ts'
import { formatCurrency } from '#/utils/number.ts'
import { DISTRICT_VALUES } from '#shared/constants/districts.constants.ts'
import { ETHNIC_GROUP_VALUES } from '#shared/constants/ethnicity.ts'
import { emptyToNull, optionalEnumSchema } from '#shared/schemas/utils.schema.ts'

const ORGANIZATION_NAME_MAX = 100
const DONATION_MESSAGE_MAX = 280

const amountSchema = z
  .int({
    error: (iss) =>
      iss.input === null
        ? 'Le montant du don est requis.'
        : 'Le montant doit être un nombre entier valide.',
  })
  .min(DONATION_MIN_AMOUNT, {
    error: (iss) => `Le montant minimum pour un don est de ${formatCurrency(Number(iss.minimum))}.`,
  })
  .max(FLEECA_MAX_AMOUNT, {
    error: (iss) => `Le montant maximum pour un don est de ${formatCurrency(Number(iss.maximum))}.`,
  })

const nameSchema = (label: string) =>
  z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(1, { error: `Le ${label} ne peut pas être vide.` })
    .max(50, { error: `Le ${label} ne doit pas dépasser 50 caractères.` })

const optionalAgeSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined))
  .pipe(
    z.union([
      z.undefined(),
      z
        .string()
        .regex(/^\d{1,3}$/, { error: "L'âge doit être un nombre entier." })
        .transform((value) => Number(value))
        .pipe(
          z
            .int()
            .min(18, {
              error: (iss) => `L'âge minimum pour faire un don est de ${iss.minimum} ans.`,
            })
            .max(120, { error: (iss) => `L'âge ne peut pas dépasser ${iss.maximum} ans.` })
        ),
    ])
  )

const optionalPhoneSchema = z
  .union([
    z
      .string()
      .trim()
      .refine((value) => /^\d{3,8}$/.test(value.replace(/\s/g, '')), {
        error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.',
      })
      .transform((value) => value.replace(/\s/g, '')),
    z.literal(''),
  ])
  .optional()
  .transform((value) => (value ? value : undefined))

const optionalAddressSchema = z
  .union([
    z
      .string()
      .trim()
      .refine((value) => value.length >= 10, {
        error: "L'adresse doit contenir au minimum 10 caractères.",
      }),
    z.literal(''),
  ])
  .optional()
  .transform((value) => (value ? value : undefined))

export const donationSchema = z
  .object({
    amount: amountSchema,
    firstname: nameSchema('prénom'),
    lastname: nameSchema('nom de famille'),
    age: optionalAgeSchema,
    ethnicity: emptyToNull(
      optionalEnumSchema(ETHNIC_GROUP_VALUES, {
        errorMessage: 'Sélectionnez une réponse valide.',
      })
    ),
    phone: optionalPhoneSchema,
    address: optionalAddressSchema,
    district: emptyToNull(
      optionalEnumSchema(DISTRICT_VALUES, {
        errorMessage: 'Sélectionnez une réponse valide.',
      })
    ),
    isOrganization: z.boolean(),
    organizationName: z
      .string()
      .trim()
      .max(ORGANIZATION_NAME_MAX, {
        error: `Le nom de l'organisation ne doit pas dépasser ${ORGANIZATION_NAME_MAX} caractères.`,
      })
      .optional()
      .transform((value) => (value ? value : undefined)),
    message: z
      .string()
      .trim()
      .max(DONATION_MESSAGE_MAX, {
        error: `Le message ne doit pas dépasser ${DONATION_MESSAGE_MAX} caractères.`,
      })
      .optional()
      .transform((value) => (value ? value : undefined)),
    anonymous: z.boolean(),
    fleecaConfirmation: z.literal(true, {
      error: 'Vous devez cocher la confirmation pour continuer.',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.isOrganization && !data.organizationName) {
      ctx.addIssue({
        code: 'custom',
        message: "Le nom de l'organisation est requis.",
        path: ['organizationName'],
      })
    }

    if (data.address && !data.district) {
      ctx.addIssue({
        code: 'custom',
        message: "Le district est requis lorsqu'une adresse est indiquée.",
        path: ['district'],
      })
    }
  })

export type DonationInput = z.input<typeof donationSchema>
export type DonationOutput = z.output<typeof donationSchema>
