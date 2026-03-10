type PersonalInformation = {
  id: string
  label: string
}

interface CivilTitleProps extends PersonalInformation {
  abbr: string
}

export interface IndividualSacramentProps extends PersonalInformation {
  required: string[]
}

export type HouseholdRoleId =
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'friend'
  | 'mother'
  | 'father'
  | 'brother'
  | 'sister'
  | 'sibling'
  | 'other'

export interface HouseholdRoleProps extends PersonalInformation {
  id: HouseholdRoleId
}

export type FamilyMember = {
  id: string
  firstname: string
  lastname: string
  age: string
  role: HouseholdRoleId
}

export const CIVIL_TITLES = [
  {
    id: 'mr',
    label: 'Monsieur',
    abbr: 'M.',
  },
  {
    id: 'mrs',
    label: 'Madame',
    abbr: 'Mme.',
  },
  {
    id: 'miss',
    label: 'Mademoiselle',
    abbr: 'Mlle.',
  },
  {
    id: 'dr',
    label: 'Docteur',
    abbr: 'Dr.',
  },
  {
    id: 'prof',
    label: 'Professeur',
    abbr: 'Prof.',
  },
  {
    id: 'master',
    label: 'Maître',
    abbr: 'Me.',
  },
  {
    id: 'brother',
    label: 'Frère',
    abbr: 'Fr.',
  },
  {
    id: 'sister',
    label: 'Soeur',
    abbr: 'Sr.',
  },
  {
    id: 'mother',
    label: 'Mère',
    abbr: 'Mre',
  },
  {
    id: 'father',
    label: 'Père',
    abbr: 'P.',
  },
  {
    id: 'abbot',
    label: 'Abbé',
    abbr: 'Abb.',
  },
  {
    id: 'rev',
    label: 'Révérend',
    abbr: 'Rév.',
  },
  {
    id: 'captain',
    label: 'Capitaine',
    abbr: 'Cpt.',
  },
  {
    id: 'lieutnant',
    label: 'Lieutenant',
    abbr: 'Lt.',
  },
  {
    id: 'colonel',
    label: 'Colonel',
    abbr: 'Col.',
  },
  {
    id: 'major',
    label: 'Major',
    abbr: 'Mjr.',
  },
  {
    id: 'sergeant',
    label: 'Sergent',
    abbr: 'Sgt.',
  },
] as const satisfies CivilTitleProps[]

export type CivilTitle = (typeof CIVIL_TITLES)[number]['id']

export const civilTitleIds = () => {
  return CIVIL_TITLES.map((t) => t.id)
}

export const getCivilTitleLabelById = (id: string) => {
  return CIVIL_TITLES.find((t) => t.id === id)?.label
}

export const MARITAL_STATUS = [
  {
    id: 'single',
    label: 'Célibataire',
  },
  {
    id: 'fiance',
    label: 'Financé(e)',
  },
  {
    id: 'married',
    label: 'Marié(e)',
  },
  {
    id: 'separated',
    label: 'Séparé(e)',
  },
  {
    id: 'divorced',
    label: 'Divorcé(e)',
  },
  {
    id: 'widowed',
    label: 'Veuf(ve)',
  },
] as const satisfies PersonalInformation[]

export type MaritalStatus = (typeof MARITAL_STATUS)[number]['id']

export const maritalStatusIds = () => {
  return MARITAL_STATUS.map((s) => s.id)
}

export const getMaritalStatusLabelById = (id: string) =>
  MARITAL_STATUS.find((t) => t.id === id)?.label

export const GENDERS = [
  {
    id: 'male',
    label: 'Homme',
  },
  {
    id: 'female',
    label: 'Femme',
  },
] as const satisfies PersonalInformation[]

export type Gender = 'male' | 'female'

export const genderIds = () => {
  return GENDERS.map((g) => g.id)
}

export const CATHOLIC_OR_OTHER = [
  {
    id: 'catholic',
    label: 'Catholique',
  },
  {
    id: 'other',
    label: 'Autre',
  },
] as const satisfies PersonalInformation[]

export type CatholicOrOther = 'catholic' | 'other'

export const catholicOrOtherIds = () => {
  return CATHOLIC_OR_OTHER.map((c) => c.id)
}

export const INDIVIDUAL_SACRAMENTS = [
  {
    id: 'baptism',
    label: 'Baptême',
    required: [],
  },
  {
    id: 'first_communion',
    label: 'Première communion',
    required: ['baptism'],
  },
  {
    id: 'confirmation',
    label: 'Confirmation',
    required: ['baptism', 'first_communion'],
  },
] satisfies IndividualSacramentProps[]

export type IndividualSacrament = (typeof INDIVIDUAL_SACRAMENTS)[number]['id']

export const individualSacramentIds = () => {
  return INDIVIDUAL_SACRAMENTS.map((s) => s.id)
}

export const getIndividualSacramentLabelById = (id: string) => {
  return INDIVIDUAL_SACRAMENTS.find((s) => s.id === id)?.label
}

export const HOUSEHOLD_ROLES = [
  {
    id: 'spouse',
    label: 'Conjoint',
  },
  {
    id: 'son',
    label: 'Fils',
  },
  {
    id: 'daughter',
    label: 'Fille',
  },
  {
    id: 'friend',
    label: 'Ami',
  },
  {
    id: 'mother',
    label: 'Mère',
  },
  {
    id: 'father',
    label: 'Père',
  },
  {
    id: 'brother',
    label: 'Frère',
  },
  {
    id: 'sister',
    label: 'Soeur',
  },
  {
    id: 'other',
    label: 'Autre',
  },
] satisfies HouseholdRoleProps[]

export type HouseholdRole = (typeof HOUSEHOLD_ROLES)[number]['id']

export const householdRoleIds = () => {
  return HOUSEHOLD_ROLES.map((r) => r.id)
}

export const getHouseholdRoleLabelById = (id: string) => {
  return HOUSEHOLD_ROLES.find((r) => r.id === id)?.label || id
}

export const SCHOOL_LEVELS = [
  { id: 'none', label: 'Aucun' },
  { id: 'highSchoolDiploma', label: "Diplôme d'études secondaires (High School Diploma)" },
  { id: 'someCollege', label: 'Études universitaires sans diplôme' },
  { id: 'associateDegree', label: "Grade d'Associé (Associate Degree)" },
  { id: 'bachelorsDegree', label: 'Premier cycle universitaire (Licence / Bachelor’s Degree)' },
  { id: 'mastersDegree', label: 'Deuxième cycle universitaire (Master’s Degree)' },
  { id: 'doctoralDegree', label: 'Doctorat' },
] as const satisfies Array<{ id: string; label: string }>

export const getSchoolLevelsIds = () => {
  return SCHOOL_LEVELS.map((l) => l.id)
}

export const getSchoolLevelLabelById = (id: string) => {
  return SCHOOL_LEVELS.find((l) => l.id === id)?.label || id
}

export type SchoolLevel = (typeof SCHOOL_LEVELS)[number]['id']

export const SPOKEN_LANGUAGES = [
  { id: 'spanish', label: 'Espagnol' },
  { id: 'french', label: 'Français' },
  { id: 'portuguese', label: 'Portugais' },
  { id: 'italian', label: 'Italien' },
  { id: 'latin', label: 'Latin' },
  { id: 'vietnamese', label: 'Vietnamien' },
  { id: 'tagalog', label: 'Tagalog (Filipino)' },
  { id: 'polish', label: 'Polonais' },
  { id: 'german', label: 'Allemand' },
  { id: 'korean', label: 'Coréen' },
  { id: 'chinese', label: 'Chinois (mandarin)' },
  { id: 'other', label: 'Autre' },
] as const satisfies Array<{ id: string; label: string }>

export const getSpokenLanguagesIds = () => {
  return SPOKEN_LANGUAGES.map((l) => l.id)
}

export const getSpokenLanguagesLabelById = (id: string) => {
  return SPOKEN_LANGUAGES.find((l) => l.id === id)?.label || id
}

export type SpokenLanguage = (typeof SPOKEN_LANGUAGES)[number]['id']

export const BAPTIZED_OPTIONS = [
  { id: 'yes', label: 'Oui' },
  { id: 'no', label: 'Non' },
  { id: 'unsure', label: 'Je ne suis pas sûr' },
] as const

export type BaptizedOption = (typeof BAPTIZED_OPTIONS)[number]['id']

export const getBaptizedOptionsIds = () => {
  return BAPTIZED_OPTIONS.map((o) => o.id)
}
