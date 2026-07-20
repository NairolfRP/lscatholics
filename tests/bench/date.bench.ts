import { bench, describe } from 'vitest'
import { formatDate, formatDateTime, yearsBetween } from '#/utils/date'

const date = new Date('2025-03-19T14:32:00Z')
const isoString = '2025-03-19T14:32:00Z'
const birth = new Date('1990-07-12T00:00:00Z')
const now = new Date('2025-03-19T00:00:00Z')

describe('formatDate', () => {
  bench('from Date', () => {
    formatDate(date)
  })

  bench('from string', () => {
    formatDate(isoString)
  })
})

describe('formatDateTime', () => {
  bench('from Date', () => {
    formatDateTime(date)
  })

  bench('from string', () => {
    formatDateTime(isoString)
  })
})

describe('yearsBetween', () => {
  bench('compute years between two dates', () => {
    yearsBetween(birth, now)
  })
})
