import { createServerFn } from '@tanstack/react-start'
import * as incidentReportService from '#/features/incident-report/server/incident-report.service.ts'
import { requirePermission } from '#/middleware/permission.middleware.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const submitIncidentReportFn = createServerFn({ method: 'POST' })
  .middleware([requirePermission('incident', 'create')])
  .validator(looseObjectSchema)
  .handler(({ data, context: { session } }) =>
    incidentReportService.submit({ data, user: session.user })
  )
