import { createEnum } from '#shared/lib/enum.ts'

/** Discord forum channel that archives the decrees of the Archdiocese. */
export const DECREES_CHANNEL_ID = '1539521428188041246'

export const [DECREE_FORUM_TAG_ID] = createEnum({
  EXECUTIVE: '1539521783781392544',
  LEGISLATIVE: '1539521868040773672',
  ADMINISTRATIVE: '1539521940719407144',
  JUDICIARY: '1539522000907796520',
  IN_EFFECT: '1539522049708654622',
  ENACTED: '1539522086933102663',
  REPEALED_OR_EXPIRED: '1539522126258765925',
  OOC_OBSOLETE: '1539522206520840292',
})

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
    tagId: DECREE_FORUM_TAG_ID.EXECUTIVE,
    label: 'Exécutif',
    description: "Les décisions d'application prises par l'Archevêque ou son délégué.",
    requiresEnactment: true,
  },
  law: {
    tagId: DECREE_FORUM_TAG_ID.LEGISLATIVE,
    label: 'Lois canoniques',
    description: "Les textes législatifs du droit propre de l'Archidiocèse.",
    requiresEnactment: true,
  },
  administrative: {
    tagId: DECREE_FORUM_TAG_ID.ADMINISTRATIVE,
    label: 'Administratif',
    description: 'Les actes de gestion courante, dont les nominations.',
    requiresEnactment: false,
  },
  judicial: {
    tagId: DECREE_FORUM_TAG_ID.JUDICIARY,
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
export const DECREE_IGNORED_TAGS = new Set<string>([
  DECREE_FORUM_TAG_ID.REPEALED_OR_EXPIRED,
  DECREE_FORUM_TAG_ID.OOC_OBSOLETE,
])

/** Tag applied once a decree has been promulgated. */
export const DECREE_ENACTED_TAG = DECREE_FORUM_TAG_ID.ENACTED

/** Tag applied once a decree is in effect. */
export const DECREE_IN_EFFECT_TAG = DECREE_FORUM_TAG_ID.IN_EFFECT
