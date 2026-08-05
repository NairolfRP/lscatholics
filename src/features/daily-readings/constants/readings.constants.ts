import type { AELFReadingType } from '#/features/daily-readings/types/aelf.types.ts'

/** Liturgical order of the readings, as they appear in the missal. */
export const READING_ORDER: readonly AELFReadingType[] = [
  'lecture_1',
  'psaume',
  'cantique',
  'lecture_2',
  'evangile',
]

export const READING_TYPE_LABELS: Partial<Record<AELFReadingType, string>> = {
  lecture_1: 'Première lecture',
  psaume: 'Psaume',
  cantique: 'Cantique',
  lecture_2: 'Deuxième lecture',
  evangile: 'Évangile',
}

export interface LiturgicalColor {
  hex: string
  name: string
}

export const LITURGICAL_COLORS: Record<string, LiturgicalColor | undefined> = {
  blanc: { hex: '#fafafa', name: 'Blanc' },
  white: { hex: '#fafafa', name: 'Blanc' },
  vert: { hex: '#16a34a', name: 'Vert' },
  green: { hex: '#16a34a', name: 'Vert' },
  rouge: { hex: '#dc2626', name: 'Rouge' },
  red: { hex: '#dc2626', name: 'Rouge' },
  violet: { hex: '#7c3aed', name: 'Violet' },
  purple: { hex: '#7c3aed', name: 'Violet' },
  rose: { hex: '#f9a8d4', name: 'Rose' },
  pink: { hex: '#f9a8d4', name: 'Rose' },
  noir: { hex: '#18181b', name: 'Noir' },
  black: { hex: '#18181b', name: 'Noir' },
}
