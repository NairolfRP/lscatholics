import { bench, describe } from 'vitest'
import { createEnum } from '#shared/lib/enum.ts'
import { isExternalLink } from '#/utils/link'
import { formatNumber } from '#/utils/number'
import { sortByToState, stateToSortBy } from '#/utils/table'

describe('formatNumber', () => {
  bench('format large number', () => {
    formatNumber(1234567.89)
  })
})

describe('createEnum', () => {
  bench('freeze enum object', () => {
    createEnum({
      admin: 'admin',
      moderator: 'moderator',
      member: 'member',
      guest: 'guest',
      priest: 'priest',
    })
  })
})

describe('isExternalLink', () => {
  bench('external url', () => {
    isExternalLink('https://example.com/path')
  })

  bench('internal url', () => {
    isExternalLink('/dashboard/settings')
  })
})

describe('table sorting helpers', () => {
  bench('stateToSortBy', () => {
    stateToSortBy([{ id: 'createdAt', desc: true }])
  })

  bench('sortByToState', () => {
    sortByToState('createdAt.desc')
  })
})
