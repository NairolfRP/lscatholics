import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as churchEventService from '#/features/church-event/server/church-event.service.ts'
import type { ChurchEvent } from '#/features/church-event/types/church-event.types.ts'
import { churchEventRepository } from '#server/repositories/church-event.repository'
import { mockUser } from '../../utils/test-unit.utils.ts'

vi.mock('#server/repositories/church-event.repository', () => ({
  churchEventRepository: {
    getChurchEventWithAuthor: vi.fn(),
    getChurchEvents: vi.fn(),
    getChurchEvent: vi.fn(),
    deleteChurchEvent: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    existsBySlug: vi.fn(),
  },
}))

const mockEvent: ChurchEvent = {
  id: 'event-1',
  title: 'Community Gathering',
  slug: 'community-gathering',
  description: 'A gathering',
  content: 'Full content',
  location: 'Church Hall',
  parish: null,
  coverImageUrl: 'https://example.com/image.jpg',
  flyerUrl: null,
  registrationRequired: false,
  maxParticipants: null,
  startDate: new Date('2025-06-01'),
  endDate: new Date('2025-06-01'),
  createdAt: new Date('2025-06-01'),
  updatedAt: new Date('2025-06-01'),
  authorId: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('getDashboardChurchEvent', () => {
  it('returns a church event when it exists', async () => {
    vi.mocked(churchEventRepository.getChurchEventWithAuthor).mockResolvedValue(
      mockEvent as unknown as Awaited<
        ReturnType<typeof churchEventRepository.getChurchEventWithAuthor>
      >
    )

    const result = await churchEventService.getDashboardChurchEvent({ id: 'event-1' })

    expect(result).toEqual(mockEvent)
  })

  it('throws notFound when the event does not exist', async () => {
    vi.mocked(churchEventRepository.getChurchEventWithAuthor).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof churchEventRepository.getChurchEventWithAuthor>>
    )

    await expect(churchEventService.getDashboardChurchEvent({ id: 'missing' })).rejects.toThrow(
      'NOT_FOUND'
    )
  })
})

describe('deleteChurchEvent', () => {
  it('deletes and returns success when the event exists', async () => {
    vi.mocked(churchEventRepository.getChurchEvent).mockResolvedValue({
      ...mockEvent,
      id: 'event-1',
    })

    const result = await churchEventService.deleteChurchEvent({
      churchEventId: 'event-1',
      user: { ...mockUser, id: 'user-1', name: 'Test', role: 'admin' },
    })

    expect(result).toEqual({ success: true })
    expect(churchEventRepository.deleteChurchEvent).toHaveBeenCalledWith({ id: 'event-1' })
  })

  it('throws NotFoundException when the event does not exist', async () => {
    vi.mocked(churchEventRepository.getChurchEvent).mockResolvedValue(
      null as unknown as Awaited<ReturnType<typeof churchEventRepository.getChurchEvent>>
    )

    await expect(
      churchEventService.deleteChurchEvent({
        churchEventId: 'missing',
        user: { ...mockUser, id: 'user-1', name: 'Test', role: 'admin' },
      })
    ).rejects.toThrow('Church Event not found')
  })
})
