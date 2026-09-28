import { test } from 'vitest'
import { isExternalLink } from '#/utils/link'
import { formatNumber } from '#/utils/number'
import { sortByToState, stateToSortBy } from '#/utils/table'
import { createEnum } from '#shared/lib/enum.ts'

test('formatNumber', async ({ bench }) => {
  await bench('format large number', () => {
    formatNumber(1234567.89)
  }).run()
})

test('createEnum', async ({ bench }) => {
  await bench('freeze enum object', () => {
    createEnum({
      admin: 'admin',
      moderator: 'moderator',
      member: 'member',
      guest: 'guest',
      priest: 'priest',
    })
  }).run()
})

test('isExternalLink', async ({ bench }) => {
  await bench.compare(
    bench('external url', () => {
      isExternalLink('https://example.com/path')
    }),
    bench('internal url', () => {
      isExternalLink('/dashboard/settings')
    })
  )
})

test('table sorting helpers', async ({ bench }) => {
  await bench.compare(
    bench('stateToSortBy', () => {
      stateToSortBy([{ id: 'createdAt', desc: true }])
    }),
    bench('sortByToState', () => {
      sortByToState('createdAt.desc')
    })
  )
})
