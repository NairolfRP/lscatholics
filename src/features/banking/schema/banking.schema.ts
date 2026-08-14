import { z } from 'zod'
import {
  BANK_TRANSFER_FORM_MAX_LENGTH,
  BANK_TRANSFER_FORM_MIN_LENGTH,
} from '#/features/banking/constants/banking.constants.ts'
import { formatCurrency } from '#/utils/number.ts'
import { ibanSchema } from '#shared/schemas/banking.schema.ts'

export const bankTransferSchema = z.object({
  iban: ibanSchema,
  amount: z
    .int({
      error: (iss) =>
        iss.input === null || iss.input === undefined || iss.input === ''
          ? 'Le montant de la transaction est requis.'
          : 'Le montant doit être un nombre entier valide.',
    })
    .min(BANK_TRANSFER_FORM_MIN_LENGTH.AMOUNT, {
      error: (iss) =>
        `Le montant minimum de la transaction est de ${formatCurrency(Number(iss.minimum))}.`,
    })
    .max(BANK_TRANSFER_FORM_MAX_LENGTH.AMOUNT, {
      error: (iss) =>
        `Une transaction supérieure à ${formatCurrency(Number(iss.maximum))} ne peut pas être effectuée via ce système. Vous devez obtenir l'approbation de l'archevêque.`,
    }),
  description: z
    .string({ error: (iss) => (iss.input === undefined ? 'Le libellé est requis.' : 'Invalide.') })
    .trim()
    .min(BANK_TRANSFER_FORM_MIN_LENGTH.DESCRIPTION, {
      error: (iss) => `Le libellé doit au minimum faire ${iss.minimum} caractères.`,
    })
    .max(BANK_TRANSFER_FORM_MAX_LENGTH.DESCRIPTION, {
      error: (iss) => `Le libellé ne doit pas dépasser ${iss.maximum} caractères.`,
    }),
  comment: z
    .string()
    .max(BANK_TRANSFER_FORM_MAX_LENGTH.COMMENT, {
      error: (iss) => `Le commentaire ne doit pas dépasser ${iss.maximum} caractères.`,
    })
    .optional(),
})

export type BankTransferInput = z.input<typeof bankTransferSchema>
