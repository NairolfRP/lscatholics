import { createServerFn } from '@tanstack/react-start'
import { baseChurchEventInteractionSchema } from '#/features/church-event/schemas/church-event.schema'
import { requirePermission } from '#/middleware/permission.middleware'
import * as churchEventService from '#server/services/church-event.service'
import { looseObjectSchema } from '#shared/schemas/common.schema'
import { dashboardSearchSchema } from '#shared/schemas/dashboard/search.schema'

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
