import { createEnum } from '#shared/lib/enum.ts'

export const [GENDER, GENDER_VALUES] = createEnum({
  MALE: 'male',
  FEMALE: 'female',
})

export const genderLabels = Object.freeze({
  [GENDER.MALE]: 'Homme',
  [GENDER.FEMALE]: 'Femme',
})

export const genderOptions = GENDER_VALUES.map((value) => ({
  value,
  label: genderLabels[value],
}))
