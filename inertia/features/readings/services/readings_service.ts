import type { AELFReading, AELFReadingsMetadata } from '@/features/readings/types/readings'
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

export function liturgicalColor(color: string | null): string {
  switch (color?.toLowerCase()) {
    case 'white':
    case 'blanc':
      return '#ffffff'
    case 'green':
    case 'vert':
      return '#10b981'
    case 'red':
    case 'rouge':
      return '#ef4444'
    case 'purple':
    case 'violet':
      return '#8b5cf6'
    case 'pink':
    case 'rose':
      return '#f9a8d4'
    case 'black':
    case 'noir':
      return '#000000'
    default:
      return '#d1d5db'
  }
}

export function getReadingTypeLabel(type: string) {
  switch (type) {
    case 'lecture_1':
      return 'Première lecture'
    case 'psaume':
      return 'Psaume'
    case 'lecture_2':
      return 'Deuxième lecture'
    case 'evangile':
      return 'Évangile'
    default:
      return null
  }
}
