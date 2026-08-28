import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { DONATION_SOURCE } from '#/features/donate/constants/donate.constants.ts'
import { donationSchema } from '#/features/donate/schemas/donate.schema.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import { paymentService } from '#server/payments/payment.service.ts'
import { FleecaClientError } from '#server/services/fleeca.service.ts'
import './donation-payment.handler'

export interface InitiateDonationResult {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  validationErrors?: Record<string, { message: string }[]>
  error?: string
}

export async function initiateDonation(data: unknown): Promise<InitiateDonationResult> {
  try {
    const parsed = await donationSchema.parseAsync(data)

    const { fleecaConfirmation: _, ...metadata } = parsed

    const { paymentId, paymentUrl } = await paymentService.initiatePayment({
      source: DONATION_SOURCE,
      amount: parsed.amount,
      metadata,
      description: `Don — ${parsed.firstname} ${parsed.lastname}`,
    })

    return { success: true, paymentId, paymentUrl }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    if (err instanceof FleecaClientError && err.code === 'UNCONFIGURED') {
      logger.warn('Attempted donation while Fleeca is not configured')
      setResponseStatus(503)
      return {
        success: false,
        error: 'Les dons en ligne sont temporairement indisponibles. Réessayez plus tard.',
      }
    }

    if (err instanceof FleecaClientError && err.code === 'HTTP' && err.status === 422) {
      logger.warn('Fleeca rejected the payment request with a validation error (422)')
      setResponseStatus(400)
      return {
        success: false,
        error: 'Les informations de paiement sont invalides. Veuillez réessayer.',
      }
    }

    logger.error({ err, data }, 'Failed to initiate a donation payment')
    setResponseStatus(500)
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du paiement. Veuillez réessayer.',
    }
  }
}
