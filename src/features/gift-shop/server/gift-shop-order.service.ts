import { randomInt } from 'node:crypto'
import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import {
  GIFT_ORDER_SOURCE,
  GIFT_SHOP_PRODUCT_BY_ID,
} from '#/features/gift-shop/constants/gift-shop.constants.ts'
import { giftOrderSchema } from '#/features/gift-shop/schemas/gift-shop.schema.ts'
import type {
  GiftOrderLine,
  GiftOrderMetadata,
} from '#/features/gift-shop/types/gift-shop.types.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { logger } from '#server/integrations/logger.ts'
import { paymentService } from '#server/payments/payment.service.ts'
import { FleecaClientError } from '#server/services/fleeca.service.ts'
import './gift-shop-payment.handler'

export interface CreateGiftOrderResult {
  success: boolean
  paymentId?: string
  paymentUrl?: string
  validationErrors?: Record<string, { message: string }[]>
  error?: string
}

const REFERENCE_PREFIX = 'GC'
const REFERENCE_LENGTH = 10
const REFERENCE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateGiftOrderReference(): string {
  let suffix = ''
  for (let i = 0; i < REFERENCE_LENGTH; i += 1) {
    suffix += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)]
  }
  return `${REFERENCE_PREFIX}-${suffix}`
}

export async function createGiftOrder(data: unknown): Promise<CreateGiftOrderResult> {
  try {
    const parsed = await giftOrderSchema.parseAsync(data)

    if (!env.GIFT_SHOP_NOTIFICATION_WEBHOOK) {
      logger.warn(
        'Attempted gift shop order while GIFT_SHOP_NOTIFICATION_WEBHOOK is not configured'
      )
      setResponseStatus(503)
      return {
        success: false,
        error: 'La boutique en ligne est temporairement indisponible. Réessayez plus tard.',
      }
    }

    const items: GiftOrderLine[] = parsed.items.map((item) => {
      const product = GIFT_SHOP_PRODUCT_BY_ID.get(item.productId)!
      return {
        productId: item.productId,
        itemId: product.itemId,
        productName: product.name,
        price: product.price,
        quantity: item.quantity,
      }
    })

    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    const reference = generateGiftOrderReference()
    const { fleecaConfirmation: _, ...metadata } = parsed

    const { paymentId, paymentUrl } = await paymentService.initiatePayment({
      source: GIFT_ORDER_SOURCE,
      amount,
      metadata: { reference, ...metadata, items } satisfies GiftOrderMetadata,
      description: `Boutique — Commande ${reference} — ${itemCount} article${itemCount > 1 ? 's' : ''}`,
    })

    return { success: true, paymentId, paymentUrl }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    if (err instanceof FleecaClientError && err.code === 'UNCONFIGURED') {
      logger.warn('Attempted gift shop order while Fleeca is not configured')
      setResponseStatus(503)
      return {
        success: false,
        error: 'La boutique en ligne est temporairement indisponible. Réessayez plus tard.',
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

    logger.error({ err }, 'Failed to initiate a gift shop order payment')
    setResponseStatus(500)
    return {
      success: false,
      error: 'Une erreur est survenue lors de la création du paiement. Veuillez réessayer.',
    }
  }
}
