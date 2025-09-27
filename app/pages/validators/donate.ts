import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
import { getEthnicsGroupsIds } from '#shared/constants/ethnicity.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'

vine.messagesProvider = new SimpleMessagesProvider({
  'amount.required': 'Le montant du don est requis.',
  'amount.number': 'Le montant doit être un nombre entier valide.',
  'amount.min': 'Le montant minimum pour un don est de 200$.',
  'amount.withoutDecimals': 'Le montant doit être un nombre entier valide.',

  'firstname.required': 'Le prénom est requis.',
  'firstname.minLength': 'Le prénom ne peut pas être vide.',
  'firstname.maxLength': 'Le prénom ne peut pas dépasser 50 caractères.',

  'lastname.required': 'Le nom de famille est requis.',
  'lastname.minLength': 'Le nom de famille ne peut pas être vide.',
  'lastname.maxLength': 'Le nom de famille ne peut pas dépasser 50 caractères.',

  'age.number': 'Âge invalide.',
  'age.min': "L'âge minimum pour faire un don est de 16 ans.",
  'age.max': "L'âge ne peut pas dépasser 120 ans.",
  'age.withoutDecimals': 'Âge invalide.',

  'ethnicity.string': 'Veuillez sélectionner un groupe ethnique valide',

  'phone.string': 'Numéro de téléphone invalide.',
  'phone.regex': 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.',

  'address.string': "L'adresse doit être une chaîne de caractères.",
  'address.minLength': "L'adresse doit contenir au minimum 10 caractères.",

  'district.string': 'Veuillez sélectionner un district valide.',
  'district.required': "Le district est requis lorsqu'une adresse est indiquée.",

  'organizationName.string': "Le nom de l'organisation doit être une chaine de caractères.",
  'organizationName.required': "Le nom de l'organisation est requis",

  'fleecaConfirmation.literal': '(( Vous devez cocher la confirmation pour continuer. ))',
})

const schema = vine.object({
  amount: vine.number().min(200).withoutDecimals(),
  firstname: vine.string().minLength(1).maxLength(50),
  lastname: vine.string().minLength(1).maxLength(50),
  age: vine.number().min(16).max(120).withoutDecimals().optional(),
  ethnicity: vine.enum(getEthnicsGroupsIds()).optional(),
  phone: vine
    .string()
    .trim()
    .regex(/^(?=(?: *\d){3,8} *$)[\d ]+$/)
    .transform((v) => v.replace(/\s/g, ''))
    .optional(),
  address: vine.string().minLength(10).optional(),
  district: vine.enum(getDistrictIds()).optional().requiredIfExists('address'),
  isOrganization: vine.boolean(),
  organizationName: vine.string().optional().requiredWhen('isOrganization', '=', true),
  anonymous: vine.boolean(),
  fleecaConfirmation: vine.literal(true),
})

export const createDonateFormValidator = vine.compile(schema)

export type DonateMetadata = Infer<typeof schema>
