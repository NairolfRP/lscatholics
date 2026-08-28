import { createEnum } from '#shared/lib/enum.ts'

export const [CIVIL_TITLE, CIVIL_TITLE_VALUES] = createEnum({
  MR: 'mr',
  MRS: 'mrs',
  MISS: 'miss',
  DR: 'dr',
  PROF: 'prof',
  MASTER: 'master',
  BROTHER: 'brother',
  SISTER: 'sister',
  MOTHER: 'mother',
  FATHER: 'father',
  ABBOT: 'abbot',
  REV: 'rev',
  CAPTAIN: 'captain',
  LIEUTENANT: 'lieutenant',
  COLONEL: 'colonel',
  MAJOR: 'major',
  SERGEANT: 'sergeant',
})

export const civilTitleLabels = Object.freeze({
  [CIVIL_TITLE.MR]: 'Monsieur',
  [CIVIL_TITLE.MRS]: 'Madame',
  [CIVIL_TITLE.MISS]: 'Mademoiselle',
  [CIVIL_TITLE.DR]: 'Docteur',
  [CIVIL_TITLE.PROF]: 'Professeur',
  [CIVIL_TITLE.MASTER]: 'Maître',
  [CIVIL_TITLE.BROTHER]: 'Frère',
  [CIVIL_TITLE.SISTER]: 'Sœur',
  [CIVIL_TITLE.MOTHER]: 'Mère',
  [CIVIL_TITLE.FATHER]: 'Père',
  [CIVIL_TITLE.ABBOT]: 'Abbé',
  [CIVIL_TITLE.REV]: 'Révérend',
  [CIVIL_TITLE.CAPTAIN]: 'Capitaine',
  [CIVIL_TITLE.LIEUTENANT]: 'Lieutenant',
  [CIVIL_TITLE.COLONEL]: 'Colonel',
  [CIVIL_TITLE.MAJOR]: 'Major',
  [CIVIL_TITLE.SERGEANT]: 'Sergent',
})

export const civilTitleOptions = CIVIL_TITLE_VALUES.map((value) => ({
  value,
  label: civilTitleLabels[value],
}))
