import { z } from 'zod'
import {
  GIFT_ORDER_QUANTITY_MAX,
  GIFT_SHOP_PRODUCTS,
} from '#/features/gift-shop/constants/gift-shop.constants.ts'
import { CIVIL_TITLE_VALUES } from '#shared/constants/civil-title.ts'

const PRODUCT_IDS = new Set(GIFT_SHOP_PRODUCTS.map((product) => product.id))

const nameSchema = (label: string) =>
  z
    .string({ error: `Le ${label} est requis.` })
    .trim()
    .min(1, { error: `Le ${label} ne peut pas être vide.` })
    .max(50, { error: `Le ${label} ne doit pas dépasser 50 caractères.` })

const cartItemSchema = z.object({
  productId: z
    .string({ error: 'Veuillez sélectionner un produit.' })
    .refine((value) => PRODUCT_IDS.has(value), { error: 'Ce produit est introuvable.' }),
  quantity: z
    .number({ error: 'La quantité doit être un nombre entier.' })
    .int({ error: 'La quantité doit être un nombre entier.' })
    .min(1, { error: (iss) => `La quantité doit être d'au moins ${iss.minimum}.` })
    .max(GIFT_ORDER_QUANTITY_MAX, {
      error: (iss) => `La quantité ne peut pas dépasser ${iss.maximum}.`,
    }),
})

const titleSchema = z.enum(CIVIL_TITLE_VALUES, {
  error: 'Veuillez sélectionner votre titre de civilité.',
})

const phoneSchema = z
  .string({ error: 'Le numéro de téléphone est requis.' })
  .trim()
  .min(1, { error: 'Le numéro de téléphone est requis.' })
  .refine((value) => /^\d{3,8}$/.test(value.replace(/\s/g, '')), {
    error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.',
  })
  .transform((value) => value.replace(/\s/g, ''))

const addressSchema = z
  .string({ error: "L'adresse est requise." })
  .trim()
  .min(1, { error: "L'adresse ne peut pas être vide." })
  .max(120, { error: "L'adresse ne doit pas dépasser 120 caractères." })

export const giftOrderSchema = z.object({
  items: z
    .array(cartItemSchema, { error: 'Votre panier est vide.' })
    .min(1, { error: 'Votre panier est vide.' })
    .max(PRODUCT_IDS.size, {
      error: `Le panier ne peut pas contenir plus de ${PRODUCT_IDS.size} articles différents.`,
    })
    .superRefine((items, ctx) => {
      const seen = new Set<string>()
      items.forEach((item, index) => {
        if (seen.has(item.productId)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'productId'],
            message: "Un article ne peut apparaître qu'une seule fois dans le panier.",
          })
        }
        seen.add(item.productId)
      })
    }),
  title: titleSchema,
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom de famille'),
  phone: phoneSchema,
  address: addressSchema,
  fleecaConfirmation: z.literal(true, {
    error: 'Vous devez cocher la confirmation pour continuer.',
  }),
})

export type GiftOrderInput = z.input<typeof giftOrderSchema>
export type GiftOrderOutput = z.output<typeof giftOrderSchema>
