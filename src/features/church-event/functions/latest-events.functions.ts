import { createServerFn } from '@tanstack/react-start'
import { churchEventRepository } from '#/server/repositories/church-event.repository'

const HOMEPAGE_EVENTS_LIMIT = 3

export const getLatestEventsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return churchEventRepository.findLatest(HOMEPAGE_EVENTS_LIMIT, {
    id: true,
    slug: true,
    title: true,
    startDate: true,
  })
})
