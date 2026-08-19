/** Discord forum channel that archives the decrees of the Archdiocese. */
export const DECREES_CHANNEL_ID = '1539521428188041246'

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
    tagId: '1539521783781392544',
    label: 'Exécutif',
    description: "Les décisions d'application prises par l'Archevêque ou son délégué.",
    requiresEnactment: true,
  },
  law: {
    tagId: '1539521868040773672',
    label: 'Lois canoniques',
    description: "Les textes législatifs du droit propre de l'Archidiocèse.",
    requiresEnactment: true,
  },
  administrative: {
    tagId: '1539521940719407144',
    label: 'Administratif',
    description: 'Les actes de gestion courante, dont les nominations.',
    requiresEnactment: false,
  },
  judicial: {
    tagId: '1539522000907796520',
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
export const DECREE_IGNORED_TAGS = new Set<string>(['1539522126258765925', '1539522206520840292'])

/** Tag applied once a decree has been promulgated. */
export const DECREE_ENACTED_TAG = '1539522086933102663'

/** Tag applied once a decree is in effect. */
export const DECREE_IN_EFFECT_TAG = '1539522049708654622'
