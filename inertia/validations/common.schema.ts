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
  .max(50, 'Le prénom ne peut pas dépasser 50 caractères.')

export const lastnameSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'Le nom de famille est requis.' : 'Valeur invalide.',
  })
  .trim()
  .min(1, { error: 'Le nom de famille ne peut pas être vide.' })
  .max(50, 'Le nom de famille ne peut pas dépasser 50 caractères.')

export const ethnicitySchema = z.enum(getEthnicsGroupsIds(), {
  error: 'Veuillez sélectionner un groupe ethnique valide.',
})

export const districtSchema = z.enum(getDistrictIds(), {
  error: 'Veuillez sélectionner un district valide.',
})

export const civilTitleSchema = z.enum(civilTitleIds(), {
  error: 'Veuillez sélectionner un titre de civilité valide.',
})

export const maritalStatusSchema = z.enum(maritalStatusIds(), {
  error: 'Veuillez sélectionner un état matrimonial valide.',
})

export const genderSchema = z.enum(genderIds(), {
  error: 'Veuillez sélectionner un sexe valide.',
})
