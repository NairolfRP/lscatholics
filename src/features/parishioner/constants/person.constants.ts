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

export const [MARITAL_STATUS, MARITAL_STATUS_VALUES] = createEnum({
  SINGLE: 'single',
  FIANCEE: 'fiance',
  MARRIED: 'married',
  SEPARATED: 'separated',
  DIVORCED: 'divorced',
  WIDOWED: 'widowed',
})

export const maritalStatusLabels = Object.freeze({
  [MARITAL_STATUS.SINGLE]: 'Célibataire',
  [MARITAL_STATUS.FIANCEE]: 'Fiancé(e)',
  [MARITAL_STATUS.MARRIED]: 'Marié(e)',
  [MARITAL_STATUS.SEPARATED]: 'Séparé(e)',
  [MARITAL_STATUS.DIVORCED]: 'Divorcé(e)',
  [MARITAL_STATUS.WIDOWED]: 'Veuf / Veuve',
})

export const maritalStatusOptions = MARITAL_STATUS_VALUES.map((value) => ({
  value,
  label: maritalStatusLabels[value],
}))

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

export const [BAPTIZED, BAPTIZED_VALUES] = createEnum({
  YES: 'yes',
  NO: 'no',
  UNSURE: 'unsure',
})

export const baptizedLabels = Object.freeze({
  [BAPTIZED.YES]: 'Oui',
  [BAPTIZED.NO]: 'Non',
  [BAPTIZED.UNSURE]: 'Je ne suis pas sûr(e)',
})

export const baptizedOptions = BAPTIZED_VALUES.map((value) => ({
  value,
  label: baptizedLabels[value],
}))

export const [RELIGION, RELIGION_VALUES] = createEnum({
  CATHOLIC: 'catholic',
  OTHER: 'other',
})

export const religionLabels = Object.freeze({
  [RELIGION.CATHOLIC]: 'Catholique',
  [RELIGION.OTHER]: 'Autre',
})

export const religionOptions = RELIGION_VALUES.map((value) => ({
  value,
  label: religionLabels[value],
}))

export const [HOUSEHOLD_ROLE, HOUSEHOLD_ROLE_VALUES] = createEnum({
  SPOUSE: 'spouse',
  SON: 'son',
  DAUGHTER: 'daughter',
  FRIEND: 'friend',
  MOTHER: 'mother',
  FATHER: 'father',
  BROTHER: 'brother',
  SISTER: 'sister',
  OTHER: 'other',
})

export const householdRoleLabels = Object.freeze({
  [HOUSEHOLD_ROLE.SPOUSE]: 'Conjoint(e)',
  [HOUSEHOLD_ROLE.SON]: 'Fils',
  [HOUSEHOLD_ROLE.DAUGHTER]: 'Fille',
  [HOUSEHOLD_ROLE.FRIEND]: 'Ami(e)',
  [HOUSEHOLD_ROLE.MOTHER]: 'Mère',
  [HOUSEHOLD_ROLE.FATHER]: 'Père',
  [HOUSEHOLD_ROLE.BROTHER]: 'Frère',
  [HOUSEHOLD_ROLE.SISTER]: 'Sœur',
  [HOUSEHOLD_ROLE.OTHER]: 'Autre',
})

export const householdRoleOptions = HOUSEHOLD_ROLE_VALUES.map((value) => ({
  value,
  label: householdRoleLabels[value],
}))

export const [ETHNIC_COMMUNITY, ETHNIC_COMMUNITY_VALUES] = createEnum({
  NONE: 'none',
  LATINO: 'latino',
  BLACK: 'black',
  IRISH: 'irish',
  ITALIAN: 'italian',
  FRENCH: 'french',
})

export const ethnicCommunityLabels = Object.freeze({
  [ETHNIC_COMMUNITY.NONE]: 'Aucune',
  [ETHNIC_COMMUNITY.LATINO]: 'Latino / Hispanique',
  [ETHNIC_COMMUNITY.BLACK]: 'Noir / Afro-américain',
  [ETHNIC_COMMUNITY.IRISH]: 'Irlandais',
  [ETHNIC_COMMUNITY.ITALIAN]: 'Italien',
  [ETHNIC_COMMUNITY.FRENCH]: 'Français',
})

export const ethnicCommunityOptions = ETHNIC_COMMUNITY_VALUES.map((value) => ({
  value,
  label: ethnicCommunityLabels[value],
}))

export const [INDIVIDUAL_SACRAMENT, INDIVIDUAL_SACRAMENT_VALUES] = createEnum({
  BAPTISM: 'baptism',
  FIRST_COMMUNION: 'first_communion',
  CONFIRMATION: 'confirmation',
})

const individualSacramentRequirements = Object.freeze({
  [INDIVIDUAL_SACRAMENT.BAPTISM]: [] as string[],
  [INDIVIDUAL_SACRAMENT.FIRST_COMMUNION]: [INDIVIDUAL_SACRAMENT.BAPTISM],
  [INDIVIDUAL_SACRAMENT.CONFIRMATION]: [
    INDIVIDUAL_SACRAMENT.BAPTISM,
    INDIVIDUAL_SACRAMENT.FIRST_COMMUNION,
  ],
})

export const individualSacramentLabels = Object.freeze({
  [INDIVIDUAL_SACRAMENT.BAPTISM]: 'Baptême',
  [INDIVIDUAL_SACRAMENT.FIRST_COMMUNION]: 'Première communion',
  [INDIVIDUAL_SACRAMENT.CONFIRMATION]: 'Confirmation',
})

export const individualSacramentOptions = INDIVIDUAL_SACRAMENT_VALUES.map((value) => ({
  value,
  label: individualSacramentLabels[value],
}))

export function getIndividualSacramentLabel(value: string) {
  return individualSacramentLabels[value as keyof typeof individualSacramentLabels]
}

export function getSacramentPrerequisites(value: string): string[] {
  return (
    individualSacramentRequirements[value as keyof typeof individualSacramentRequirements] ?? []
  )
}
