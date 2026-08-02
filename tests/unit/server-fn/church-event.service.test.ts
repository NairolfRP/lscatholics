import { eq } from 'drizzle-orm'
import { describe, expect, it } from 'vitest'
import * as churchEventService from '#/features/church-event/server/church-event.service.ts'
import { db } from '#server/db'
import { churchEvents } from '#server/db/schema'
import { mockUser } from '../../utils/test-unit.utils.ts'

async function insertEvent(overrides: Partial<typeof churchEvents.$inferInsert> = {}) {
  const [event] = await db
    .insert(churchEvents)
    .values({
      title: 'Messe dominicale',
      slug: 'messe-dominicale',
      description: 'La messe dominicale de la paroisse',
      content: 'Contenu complet',
      location: 'Cathédrale Saint-Michel',
      coverImageUrl: 'https://example.com/messe.webp',
      startDate: new Date('2026-01-11T10:00:00Z'),
      ...overrides,
    })
    .returning()

  return event
}

describe('getSingleChurchEvent', () => {
  it('returns the event for a known slug', async () => {
    await insertEvent()

    const result = await churchEventService.getSingleChurchEvent({ slug: 'messe-dominicale' })

    expect(result).toMatchObject({
      slug: 'messe-dominicale',
      title: 'Messe dominicale',
      description: 'La messe dominicale de la paroisse',
      location: 'Cathédrale Saint-Michel',
    })
  })

  it('throws notFound for an unknown slug', async () => {
    await expect(churchEventService.getSingleChurchEvent({ slug: 'inconnu' })).rejects.toThrow(
      'NOT_FOUND'
    )
  })
})

describe('getDashboardChurchEvent', () => {
  it('returns the event for a known id', async () => {
    const event = await insertEvent()

    const result = await churchEventService.getDashboardChurchEvent({ id: event.id })

    expect(result.title).toBe('Messe dominicale')
  })

  it('throws notFound for an unknown id', async () => {
    await expect(churchEventService.getDashboardChurchEvent({ id: 'inconnu' })).rejects.toThrow(
      'NOT_FOUND'
    )
  })
})

describe('deleteChurchEvent', () => {
  it('deletes the event', async () => {
    const event = await insertEvent()

    const result = await churchEventService.deleteChurchEvent({
      churchEventId: event.id,
      user: mockUser,
    })

    expect(result).toEqual({ success: true })

    const [remaining] = await db.select().from(churchEvents).where(eq(churchEvents.id, event.id))

    expect(remaining).toBeUndefined()
  })

  it('throws NotFoundException for an unknown id', async () => {
    await expect(
      churchEventService.deleteChurchEvent({ churchEventId: 'inconnu', user: mockUser })
    ).rejects.toThrow('Church Event not found')
  })
})
