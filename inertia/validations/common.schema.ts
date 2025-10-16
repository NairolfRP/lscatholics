import { z } from 'zod'
import { getEthnicsGroupsIds } from '#shared/constants/ethnicity.constants'
import { getDistrictIds } from '#shared/constants/districts.constants'

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
