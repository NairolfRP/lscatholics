import type { AELFReading, AELFReadingsMetadata } from '@/features/readings/types/readings.types'
import { READING_ORDER } from '@/features/readings/constants/readings.constants'

export function sortReadings(readings: AELFReading[]): AELFReading[] {
  return READING_ORDER.map((v) => readings.find((r) => r.type === v) ?? null).filter(
    Boolean
  ) as AELFReading[]
}

export function getLiturgicalHeader(info: AELFReadingsMetadata) {
  const mainName = info.jour_liturgique_nom || info.ligne1 || ''
  const subFeast = info.fete && info.fete !== mainName ? info.fete : null
  const subDegree =
    info.ligne3 ||
    (info.degre && info.degre !== mainName && info.degre !== info.fete ? info.degre : null)

  const weekday = info.date
    ? new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(new Date(info.date))
    : ''

  return {
    mainName,
    subFeast,
    subDegree,
    couleur: info.couleur,
    couleur2: info.couleur2,
    dateInfo: { weekday, semaine: info.semaine, annee: info.annee },
  }
}
