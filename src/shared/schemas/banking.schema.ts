import { z } from 'zod'

const baseIban = z.string().min(1, "Le format de l'IBAN n'est pas valide")

export const ibanSchema = baseIban.refine((val) => /^0(100|200|300)\d{5}$/.test(val), {
  message: "Le format de l'IBAN n'est pas valide",
})

export const individualIban = baseIban.refine((val) => /^0(100)\d{5}$/.test(val), {
  message: "Le format de l'IBAN n'est pas valide",
})

export const organizationIban = baseIban.refine((val) => /^0(200|300)\d{5}$/.test(val), {
  message: "Le format de l'IBAN n'est pas valide",
})
