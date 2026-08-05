import { createEnum } from '#shared/lib/enum.ts'

export const [CONTACT_SUBJECT, CONTACT_SUBJECT_VALUES] = createEnum({
  SACRAMENTS: 'sacrements',
  ARCHBISHOP: 'archbishop',
  CHANCERY: 'chancery',
  VOCATIONS: 'vocations',
  PARISHES: 'parishes',
  PRESS: 'press',
  EXORCISM: 'exorcism',
  TRIBUNAL: 'tribunal',
  VOLUNTEERING: 'volunteering',
  DONATIONS: 'donations',
  OTHER: 'other',
})

export const contactSubjectLabels = Object.freeze({
  [CONTACT_SUBJECT.SACRAMENTS]: 'Sacrements',
  [CONTACT_SUBJECT.ARCHBISHOP]: 'Cardinal Ronan Callahan',
  [CONTACT_SUBJECT.CHANCERY]: 'Chancellerie',
  [CONTACT_SUBJECT.VOCATIONS]: 'Vocations',
  [CONTACT_SUBJECT.PARISHES]: 'Paroisses',
  [CONTACT_SUBJECT.PRESS]: 'Presse / Médias',
  [CONTACT_SUBJECT.EXORCISM]: "Service de l'Exorcisme",
  [CONTACT_SUBJECT.TRIBUNAL]: 'Tribunal ecclésiastique',
  [CONTACT_SUBJECT.VOLUNTEERING]: 'Bénévolat',
  [CONTACT_SUBJECT.DONATIONS]: 'Dons et legs',
  [CONTACT_SUBJECT.OTHER]: 'Autre',
})

export const contactSubjectOptions = CONTACT_SUBJECT_VALUES.map((value) => ({
  value,
  label: contactSubjectLabels[value],
}))
