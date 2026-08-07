import { createEnum } from '#shared/lib/enum.ts'

export const [ETHNIC_GROUP, ETHNIC_GROUP_VALUES] = createEnum({
  WHITE: 'white',
  HISPANIC: 'hispanic',
  BLACK: 'black',
  NATIVE_AMERICAN: 'nativeAmerican',
  ASIAN: 'asian',
  PACIFIC_ISLANDER: 'pacificIslander',
  OTHER: 'other',
})

export const ethnicGroupLabels = Object.freeze({
  [ETHNIC_GROUP.WHITE]: 'Blanc',
  [ETHNIC_GROUP.HISPANIC]: 'Hispanique / Latino',
  [ETHNIC_GROUP.BLACK]: 'Noir / Afro-Américain',
  [ETHNIC_GROUP.NATIVE_AMERICAN]: 'Amérindien / Autochtone d’Alaska',
  [ETHNIC_GROUP.ASIAN]: 'Asiatique',
  [ETHNIC_GROUP.PACIFIC_ISLANDER]: 'Hawaïen / Océanien',
  [ETHNIC_GROUP.OTHER]: 'Autre ethnie',
})

export const ethnicGroupOptions = ETHNIC_GROUP_VALUES.map((value) => ({
  value,
  label: ethnicGroupLabels[value],
}))
