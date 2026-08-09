import { createEnum } from '#shared/lib/enum.ts'

export const [SPOKEN_LANGUAGE, SPOKEN_LANGUAGE_VALUES] = createEnum({
  SPANISH: 'spanish',
  FRENCH: 'french',
  PORTUGUESE: 'portuguese',
  ITALIAN: 'italian',
  LATIN: 'latin',
  VIETNAMESE: 'vietnamese',
  TAGALOG: 'tagalog',
  POLISH: 'polish',
  GERMAN: 'german',
  KOREAN: 'korean',
  CHINESE: 'chinese',
  OTHER: 'other',
})

export const spokenLanguageLabels = Object.freeze({
  [SPOKEN_LANGUAGE.SPANISH]: 'Espagnol',
  [SPOKEN_LANGUAGE.FRENCH]: 'Français',
  [SPOKEN_LANGUAGE.PORTUGUESE]: 'Portugais',
  [SPOKEN_LANGUAGE.ITALIAN]: 'Italien',
  [SPOKEN_LANGUAGE.LATIN]: 'Latin',
  [SPOKEN_LANGUAGE.VIETNAMESE]: 'Vietnamien',
  [SPOKEN_LANGUAGE.TAGALOG]: 'Tagalog (Filipino)',
  [SPOKEN_LANGUAGE.POLISH]: 'Polonais',
  [SPOKEN_LANGUAGE.GERMAN]: 'Allemand',
  [SPOKEN_LANGUAGE.KOREAN]: 'Coréen',
  [SPOKEN_LANGUAGE.CHINESE]: 'Chinois (mandarin)',
  [SPOKEN_LANGUAGE.OTHER]: 'Autre',
})

export const spokenLanguageOptions = SPOKEN_LANGUAGE_VALUES.map((value) => ({
  value,
  label: spokenLanguageLabels[value],
}))
