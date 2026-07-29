import { notFound } from '@tanstack/react-router'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import {
  createChurchEventSchema,
  editChurchEventSchema,
} from '#/features/church-event/schemas/church-event.schema'
import { getFieldErrors } from '#/utils/form'
import { resolveSlug } from '#/utils/slug'
import { NotFoundException } from '#server/exceptions/http-exception'
import { logger } from '#server/integrations/logger'
import { churchEventRepository } from '#server/repositories/church-event.repository'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard'
import type { User } from '#shared/lib/types/auth'

export async function getDashboardChurchEvent({ id }: { id: string }) {
  const churchEvent = await churchEventRepository.getChurchEventWithAuthor({
    id,
    authorColumns: {
      id: true,
      name: true,
    },
    includeEndedEvent: true,
  })

  if (!churchEvent) {
    throw notFound()
  }

  return churchEvent
}

export async function getDashboardChurchEvents({
  data,
}: {
  data: { page: number; sortBy: string; search?: string }
}) {
  return churchEventRepository.getChurchEvents({
    columns: {
      id: true,
      title: true,
      location: true,
      startDate: true,
      endDate: true,
      maxParticipants: true,
      authorId: true,
    },
    page: data.page,
    pageSize: DASHBOARD_PAGINATION_LIMIT,
    orderBy: [data.sortBy],
    includeEndedEvents: true,
    searchText: data.search
      ? [
          { column: 'title', text: `%${data.search}%` },
          { column: 'description', text: `%${data.search}%` },
          { column: 'content', text: `%${data.search}%` },
          { column: 'location', text: `%${data.search}%` },
        ]
      : undefined,
  })
}

export async function deleteChurchEvent({
  churchEventId,
  user,
}: {
  churchEventId: string
  user: User
}) {
  const churchEvent = await churchEventRepository.getChurchEvent({
    id: churchEventId,
    includeEndedEvent: true,
    columns: { id: true },
  })

  if (!churchEvent) {
    setResponseStatus(404)
    throw NotFoundException('Church Event not found')
  }

  try {
    await churchEventRepository.deleteChurchEvent({ id: churchEvent.id })
    return { success: true }
  } catch (err) {
    logger.error(
      {
        err,
        user: { id: user.id, name: user.name, roles: JSON.stringify(user.role.split(',')) },
      },
      "Failed to delete church event (id: '%s')",
      churchEvent.id
    )

    setResponseStatus(500)
    throw new Error('Internal error')
  }
}

export async function updateChurchEvent({ data, user }: { data: unknown; user: User }) {
  const schema = z
    .object({
      churchEventId: z.uuidv4({
        error: (iss) => (iss.input === undefined ? 'Missing church event ID' : 'Bad ID format'),
      }),
    })
    .catchall(z.unknown())
    .refine((obj) => Object.keys(obj).length > 1, {
      error: 'Invalid body',
    })

  const { churchEventId, ...values } = await schema.parseAsync(data)

  const churchEvent = await churchEventRepository.getChurchEvent({
    id: churchEventId,
    columns: {
      slug: true,
    },
    includeEndedEvent: true,
  })

  if (!churchEvent) {
    throw NotFoundException('Church Event not found')
  }

  try {
    const validatedData = await editChurchEventSchema.parseAsync(values)

    let slug = resolveSlug(validatedData.slug, validatedData.title)
    if (slug !== churchEvent.slug && (await churchEventRepository.existsBySlug(slug))) {
      let counter = 1
      const baseSlug = slug
      while (await churchEventRepository.existsBySlug(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const maxParticipants = validatedData.registrationRequired
      ? validatedData.maxParticipants
      : null

    await churchEventRepository.update(
      { id: churchEventId },
      { ...validatedData, slug, maxParticipants }
    )

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, error: null, validationErrors }
    }

    logger.error({ err, churchEventId, userId: user.id }, 'Failed to update church event')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

export async function createChurchEvent({ data, user }: { data: unknown; user: User }) {
  try {
    const validatedData = await createChurchEventSchema.parseAsync(data)

    let slug = resolveSlug(validatedData.slug, validatedData.title)

    if (await churchEventRepository.existsBySlug(slug)) {
      let counter = 1
      const baseSlug = slug
      while (await churchEventRepository.existsBySlug(slug)) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    const maxParticipants = validatedData.registrationRequired
      ? validatedData.maxParticipants
      : null

    const createdChurchEvent = await churchEventRepository.create(
      {
        title: validatedData.title,
        slug,
        description: validatedData.description,
        content: validatedData.content,
        location: validatedData.location,
        parish: validatedData.parish,
        coverImageUrl: validatedData.coverImageUrl,
        flyerUrl: validatedData.flyerUrl,
        registrationRequired: validatedData.registrationRequired,
        maxParticipants,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        authorId: user.id,
      },
      { returning: ['id'] }
    )

    return { success: true, churchEventId: createdChurchEvent[0].id }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, data, userId: user.id }, 'Failed to create church event')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
