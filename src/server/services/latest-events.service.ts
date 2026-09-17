import { handleServiceError } from '#server/exceptions/service-error'
import { churchEventRepository } from '#server/repositories/church-event.repository'

const HOMEPAGE_EVENTS_LIMIT = 3

export async function getLatestEvents() {
  try {
    return await churchEventRepository.findLatest(HOMEPAGE_EVENTS_LIMIT, {
      id: true,
      slug: true,
      title: true,
      startDate: true,
    })
  } catch (err) {
    handleServiceError(err, { limit: HOMEPAGE_EVENTS_LIMIT }, 'Failed to get latest events')
  }
}
