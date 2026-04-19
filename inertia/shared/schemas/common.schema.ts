import { z } from 'zod'
import { getEthnicsGroupsIds } from '#shared/constants/ethnicity.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'
import { civilTitleIds, genderIds, maritalStatusIds } from '#shared/constants/person.constants'

export const firstnameSchema = z
  .string({
    error: (issue) => (issue.input === undefined ? 'Le prénom est requis.' : 'Valeur invalide.'),
  })
  .trim()
  .min(1, { error: 'Le prénom ne peut pas être vide.' })
  .max(30, 'Le prénom ne peut pas dépasser 30 caractères.')

export const middleNameSchema = z
  .string({
    error: 'Valeur invalide.',
  })
  .trim()
  .max(30, 'Le deuxième prénom ne peut pas dépasser 30 caractères.')
  .optional()

export const lastnameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Le nom de famille est requis.' : 'Valeur invalide.',
  })
  .trim()
  .min(1, { error: 'Le nom de famille ne peut pas être vide.' })
  .max(30, 'Le nom de famille ne peut pas dépasser 30 caractères.')

export const ethnicitySchema = z.enum(getEthnicsGroupsIds(), {
  error: 'Veuillez sélectionner un groupe ethnique valide.',
})

export const optionalPhoneSchema = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true
      const digitsOnly = val.replace(/\s/g, '')
      return /^\d{3,8}$/.test(digitsOnly)
    },
    { error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.' }
  )
  .transform((v) => (v ? v.replace(/\s/g, '') : undefined))

export const phoneSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Le numéro de téléphone est requis.' : 'Valeur invalide.',
  })
  .refine(
    (val) => {
      const digitsOnly = val.replace(/\s/g, '')
      return /^\d{3,8}$/.test(digitsOnly)
    },
    { error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.' }
  )
  .transform((v) => v.replace(/\s/g, ''))

export const phoneSchemaOptional = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Le numéro de téléphone est requis.' : 'Valeur invalide.',
  })
  .optional()
  .refine(
    (val) => {
      if (!val || val.trim() === '') return true
      const digitsOnly = val.replace(/\s/g, '')
      return /^\d{3,8}$/.test(digitsOnly)
    },
    { error: 'Le numéro de téléphone doit contenir entre 3 et 8 chiffres.' }
  )

export const addressSchema = z
  .string({
    error: (issue) => (issue.inputed === undefined ? "L'adresse est requise." : 'Valeur invalide.'),
  })
  .trim()
  .min(10, { error: "L'adresse doit contenir au moins 10 caractères" })
  .max(255, { error: "L'adresse ne doit pas dépasser 255 caractères." })

export const districtSchema = z.enum(getDistrictIds(), {
  error: 'Veuillez sélectionner un district valide.',
})

const preprocessedAge = (schema: any) => {
  return z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined
    const num = Number(val)
    return Number.isNaN(num) ? undefined : num
  }, schema)
}

export const ageSchema = preprocessedAge(
  z
    .int({ error: "L'âge doit être un nombre entier." })
    .min(16, { error: "L'âge minimum pour s'enregistrer est de 16 ans." })
    .max(120, { error: "L'âge ne peut pas dépasser 120 ans." })
)

export const civilTitleSchema = z.enum(civilTitleIds(), {
  error: 'Veuillez sélectionner un titre de civilité valide.',
})

export const maritalStatusSchema = z.enum(maritalStatusIds(), {
  error: 'Veuillez sélectionner un état matrimonial valide.',
})

export const genderSchema = z.enum(genderIds(), {
  error: (issue) =>
    issue.input === undefined ? 'Le sexe est requis.' : 'Veuillez sélectionner un sexe valide.',
})

export const yesNoSchema = z.boolean({
  error: (issue) =>
    issue.input === undefined ? 'Vous devez sélectionner une réponse.' : 'Valeur invalide.',
})
