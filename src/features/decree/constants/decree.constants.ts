/** Discord forum channel that archives the decrees of the Archdiocese. */
export const DECREES_CHANNEL_ID = '1253466164294582332'

export type DecreeCategory = 'executive' | 'law' | 'administrative' | 'judicial'

export const DECREE_CATEGORY_ORDER: readonly DecreeCategory[] = [
  'executive',
  'law',
  'administrative',
  'judicial',
] as const

export interface DecreeCategoryConfig {
  /** Discord forum tag id that marks a thread as part of this category. */
  tagId: string
  label: string
  description: string
  /**
   * Executive and legislative decrees only count as published once they have been
   * promulgated (or are in effect). Administrative and judicial acts have no such gate.
   */
  requiresEnactment: boolean
}

export const DECREE_CATEGORIES: Record<DecreeCategory, DecreeCategoryConfig> = {
  executive: {
    tagId: '1253567271410864178',
    label: 'Exécutif',
    description: "Les décisions d'application prises par l'Archevêque ou son délégué.",
    requiresEnactment: true,
  },
  law: {
    tagId: '1253567318722613319',
    label: 'Lois canoniques',
    description: "Les textes législatifs du droit propre de l'Archidiocèse.",
    requiresEnactment: true,
  },
  administrative: {
    tagId: '1253567373227724891',
    label: 'Administratif',
    description: 'Les actes de gestion courante émis par la Chancellerie.',
    requiresEnactment: false,
  },
  judicial: {
    tagId: '1253567421843902484',
    label: 'Judiciaire',
    description:
      'Les décisions rendues dans le cadre du pouvoir judiciaire du siège archiépiscopal.',
    requiresEnactment: false,
  },
}

export const DECREE_CATEGORY_BY_TAG_ID = Object.fromEntries(
  DECREE_CATEGORY_ORDER.map((category) => [DECREE_CATEGORIES[category].tagId, category])
) as Record<string, DecreeCategory>

/** Threads carrying one of these tags are never exposed (drafts, internal notes…). */
export const DECREE_IGNORED_TAGS = new Set<string>(['1253567595970301992', '1415400158560256111'])

/** Tag applied once a decree has been promulgated. */
export const DECREE_ENACTED_TAG = '1253567512705237033'

/** Tag applied once a decree is in effect. */
export const DECREE_IN_EFFECT_TAG = '1253567463568965714'
