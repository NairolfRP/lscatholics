import { createEnum } from '#shared/lib/enum.ts'

export const [CHURCH_SERVICE, CHURCH_SERVICE_VALUES] = createEnum({
  INITIATION: 'christian_initiation',
  MASS_INTENTION: 'mass_intention',
  CONFESSION: 'confession',
  SICK: 'sick',
  MARRIAGE: 'marriage',
  FUNERALS: 'funerals',
  EXORCISM: 'exorcism',
  BENEDICTION: 'benediction',
  CONFERENCE: 'conference',
  MEDIATION: 'mediation',
  QUINCEANERA: 'quinceanera',
})
