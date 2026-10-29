import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import { incidentReportSchema } from '#/features/incident-report/schemas/incident-report.schema.ts'
import { sendIncidentReportNotification } from '#/features/incident-report/server/incident-report-notification.service.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import type { User } from '#shared/lib/types/auth.ts'

export async function submit({ data, user }: { data: unknown; user: User }) {
  const webhookUrl = env.INCIDENT_REPORT_DISCORD_WEBHOOK

  if (!webhookUrl) {
    logger.error(
      { userId: user.id },
      'Missing INCIDENT_REPORT_DISCORD_WEBHOOK environment variable'
    )
    setResponseStatus(500)
    return {
      success: false,
      error:
        'Le formulaire de rapport d’incident est temporairement indisponible. Réessayez plus tard.',
    }
  }

  try {
    const validatedData = await incidentReportSchema.parseAsync(data)

    await sendIncidentReportNotification({ webhookUrl, data: validatedData })

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      setResponseStatus(400)
      return { success: false, validationErrors: getFieldErrors(err) }
    }

    logger.error({ err, userId: user.id }, 'Failed to submit the incident report')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}
