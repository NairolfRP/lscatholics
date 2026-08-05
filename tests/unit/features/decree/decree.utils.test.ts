import { describe, expect, it } from 'vitest'
import {
  DECREE_CATEGORIES,
  DECREE_ENACTED_TAG,
  DECREE_IGNORED_TAGS,
  DECREE_IN_EFFECT_TAG,
} from '#/features/decree/constants/decree.constants.ts'
import {
  buildDecreeUid,
  compareByDateDesc,
  getThreadCategory,
  isDecreeEnacted,
  isDecreeInEffect,
  isThreadIgnored,
  isThreadPublishable,
  parseDecreeUid,
  slugifyTitle,
} from '#/features/decree/utils/decree.utils.ts'

const CATEGORY_TAGS = {
  executive: DECREE_CATEGORIES.executive.tagId,
  law: DECREE_CATEGORIES.law.tagId,
  administrative: DECREE_CATEGORIES.administrative.tagId,
  judicial: DECREE_CATEGORIES.judicial.tagId,
} as const

describe('getThreadCategory', () => {
  it('maps a category tag to its category', () => {
    expect(getThreadCategory([CATEGORY_TAGS.executive])).toBe('executive')
    expect(getThreadCategory([CATEGORY_TAGS.law])).toBe('law')
    expect(getThreadCategory([CATEGORY_TAGS.administrative])).toBe('administrative')
    expect(getThreadCategory([CATEGORY_TAGS.judicial])).toBe('judicial')
  })

  it('returns the first matching category when several tags are applied', () => {
    expect(getThreadCategory([CATEGORY_TAGS.judicial, CATEGORY_TAGS.executive])).toBe('judicial')
  })

  it('returns null when no category tag is applied', () => {
    expect(getThreadCategory([DECREE_ENACTED_TAG, 'some-other-tag'])).toBeNull()
    expect(getThreadCategory([])).toBeNull()
  })
})

describe('isThreadIgnored', () => {
  it('returns true when an ignored tag is applied', () => {
    expect(isThreadIgnored(Array.from(DECREE_IGNORED_TAGS))).toBe(true)
  })

  it('returns false otherwise', () => {
    expect(isThreadIgnored([CATEGORY_TAGS.executive])).toBe(false)
    expect(isThreadIgnored([])).toBe(false)
  })
})

describe('isDecreeEnacted', () => {
  it('returns true when the enactment tag is applied', () => {
    expect(isDecreeEnacted([DECREE_ENACTED_TAG])).toBe(true)
  })

  it('returns false otherwise', () => {
    expect(isDecreeEnacted([])).toBe(false)
    expect(isDecreeEnacted([CATEGORY_TAGS.executive])).toBe(false)
  })
})

describe('isDecreeInEffect', () => {
  it('returns true when the in-effect tag is applied', () => {
    expect(isDecreeInEffect([DECREE_IN_EFFECT_TAG])).toBe(true)
  })

  it('returns false otherwise', () => {
    expect(isDecreeInEffect([])).toBe(false)
  })
})

describe('isThreadPublishable', () => {
  it('rejects ignored threads', () => {
    const ignoredTag = [...DECREE_IGNORED_TAGS][0]
    expect(isThreadPublishable([CATEGORY_TAGS.executive, DECREE_ENACTED_TAG, ignoredTag])).toBe(
      false
    )
  })

  it('requires enactment for executive decrees', () => {
    expect(isThreadPublishable([CATEGORY_TAGS.executive])).toBe(false)
    expect(isThreadPublishable([CATEGORY_TAGS.executive, DECREE_ENACTED_TAG])).toBe(true)
    expect(isThreadPublishable([CATEGORY_TAGS.executive, DECREE_IN_EFFECT_TAG])).toBe(true)
  })

  it('requires enactment for laws', () => {
    expect(isThreadPublishable([CATEGORY_TAGS.law])).toBe(false)
    expect(isThreadPublishable([CATEGORY_TAGS.law, DECREE_ENACTED_TAG])).toBe(true)
  })

  it('publishes administrative and judicial acts without enactment', () => {
    expect(isThreadPublishable([CATEGORY_TAGS.administrative])).toBe(true)
    expect(isThreadPublishable([CATEGORY_TAGS.judicial])).toBe(true)
  })

  it('publishes threads without any category tag when not ignored', () => {
    expect(isThreadPublishable([DECREE_ENACTED_TAG])).toBe(true)
  })
})

describe('slugifyTitle', () => {
  it('slugifies accents, spaces and special characters', () => {
    expect(slugifyTitle('Décret n° 12 — Réorganisation du diocèse !')).toBe(
      'decret-n-12-reorganisation-du-diocese'
    )
  })
})

describe('buildDecreeUid', () => {
  it('joins the thread id and the slugified title', () => {
    expect(buildDecreeUid('1253466164294582332', 'Décret de nomination')).toBe(
      '1253466164294582332-decret-de-nomination'
    )
  })
})

describe('parseDecreeUid', () => {
  it('parses a valid uid into threadId and slug', () => {
    expect(parseDecreeUid('1253466164294582332-decret-de-nomination')).toEqual({
      threadId: '1253466164294582332',
      slug: 'decret-de-nomination',
    })
  })

  it('handles slugs that contain dashes', () => {
    expect(parseDecreeUid('1253466164294582332-decret-avec-des-tirets')?.slug).toBe(
      'decret-avec-des-tirets'
    )
  })

  it('rejects uids without a thread id', () => {
    expect(parseDecreeUid('just-a-slug')).toBeNull()
  })

  it('rejects uids whose thread id is not a snowflake', () => {
    expect(parseDecreeUid('abc-decret')).toBeNull()
    expect(parseDecreeUid('123-decret')).toBeNull()
  })

  it('rejects uids with an empty slug', () => {
    expect(parseDecreeUid('1253466164294582332-')).toBeNull()
  })
})

describe('compareByDateDesc', () => {
  it('sorts ISO dates descending', () => {
    expect(
      ['2026-01-02T00:00:00.000Z', '2026-03-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'].sort(
        compareByDateDesc
      )
    ).toEqual(['2026-03-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z'])
  })

  it('moves threads without a timestamp last', () => {
    expect(
      ['2026-01-02T00:00:00.000Z', null, '2026-01-01T00:00:00.000Z'].sort(compareByDateDesc)
    ).toEqual(['2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z', null])
  })

  it('treats equal values as equal', () => {
    expect(compareByDateDesc(null, null)).toBe(0)
    expect(compareByDateDesc('2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(0)
  })
})
