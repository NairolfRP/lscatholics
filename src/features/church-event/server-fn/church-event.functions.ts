import { createServerFn } from '@tanstack/react-start'
import {
  baseChurchEventInteractionSchema,
  churchEventsPageFnSchema,
} from '#/features/church-event/schemas/church-event.schema.ts'
import * as churchEventService from '#/features/church-event/server/church-event.service.ts'
import { getChurchEventsByYearMonth } from '#/features/church-event/server/church-event.service.ts'
import { requirePermission } from '#/middleware/permission.middleware.ts'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema.ts'
import { slugSchema } from '#shared/schemas/slug.schema.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const getChurchEventsByYearMonthFn = createServerFn({ method: 'GET' })
  .validator(churchEventsPageFnSchema)
  .handler(async ({ data }) => getChurchEventsByYearMonth(data))

export const getSingleChurchEventFn = createServerFn({ method: 'GET' })
  .validator(slugSchema)
  .handler(async ({ data: slug }) => churchEventService.getSingleChurchEvent({ slug }))

export const getDashboardChurchEventFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('event', 'read')])
  .validator((id: string) => id)
  .handler(async ({ data }) => churchEventService.getDashboardChurchEvent({ id: data }))

export const getDashboardChurchEventsFn = createServerFn({ method: 'GET' })
  .middleware([requirePermission('event', 'read')])
  .validator(dashboardSearchSchema)
  .handler(async ({ data }) => churchEventService.getDashboardChurchEvents({ data }))

export const deleteChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('event', 'delete')])
  .validator(baseChurchEventInteractionSchema)
  .handler(async ({ data, context }) =>
    churchEventService.deleteChurchEvent({
      churchEventId: data.churchEventId,
      user: context.session.user,
    })
  )

export const updateChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('event', 'update')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    churchEventService.updateChurchEvent({ data, user: context.session.user })
  )

export const createChurchEventFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('event', 'create')])
  .validator(looseObjectSchema)
  .handler(async ({ data, context }) =>
    churchEventService.createChurchEvent({ data, user: context.session.user })
  )
