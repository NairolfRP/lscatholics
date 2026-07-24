import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import {
  baseChurchEventInteractionSchema,
  createChurchEventSchema,
  editChurchEventSchema,
} from '#/features/church-event/schemas/church-event.schema.ts'
import { requireDashboardAccess } from '#/middleware/permission.middleware.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { resolveSlug } from '#/utils/slug.ts'
import { NotFoundException } from '#server/exceptions/http-exception.ts'
import { logger } from '#server/integrations/logger.ts'
import { churchEventRepository } from '#server/repositories/church-event.repository.ts'
import { DASHBOARD_PAGINATION_LIMIT } from '#shared/constants/dashboard.ts'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'

export const getDashboardChurchEventFn = createServerFn({ method: 'GET' })
  .middleware([requireDashboardAccess])
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const churchEvent = await churchEventRepository.getChurchEventWithAuthor({
      id: data,
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
  })

export const getDashboardChurchEventsFn = createServerFn({ method: 'GET' })
  .middleware([requireDashboardAccess])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => {
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
  })

export const deleteChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(baseChurchEventInteractionSchema)
  .handler(async ({ data, context }) => {
    const churchEvent = await churchEventRepository.getChurchEvent({
      id: data.churchEventId,
      includeEndedEvent: true,
      columns: { id: true, authorId: true },
    })

    if (!churchEvent) {
      setResponseStatus(404)
      throw NotFoundException('Church Event not found')
    }

    try {
      await churchEventRepository.deleteChurchEvent({ id: churchEvent.id })
      return { success: true }
    } catch (err) {
      const user = context.session.user

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
  })

export const updateChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(async (data: unknown) => {
    const schema = z
      .object({
        churchEventId: z.cuid2({
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

    return { churchEventId, churchEvent, values }
  })
  .handler(async ({ data: rawData, context }) => {
    const { churchEventId, churchEvent, values } = rawData

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

      logger.error(
        { err, churchEventId, userId: context.session.user.id },
        'Failed to update church event'
      )
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })

export const createChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requireDashboardAccess])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) => {
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
          authorId: context.session.user.id,
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

      logger.error({ err, data, userId: context.session.user.id }, 'Failed to create church event')
      setResponseStatus(500)
      return { success: false, error: 'Une erreur est survenue' }
    }
  })
