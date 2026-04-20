import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#billing/services/payment_service'
import PaymentException from '#billing/exceptions/payment_exception'

@inject()
export default class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  async webhook({ request, response, logger }: HttpContext) {
    const rawBody = request.raw() ?? ''
    const signature = request.header('X-Fleeca-Signature') ?? ''

    if (!signature) {
      logger.warn('Webhook received without X-Fleeca-Signature header')
      return response.status(403).send('Forbidden')
    }

    try {
      await this.paymentService.processWebhook(rawBody, signature)
      return response.status(200).send('OK')
    } catch (err) {
      if (err instanceof PaymentException && err.code === 'WEBHOOK_SIGNATURE_INVALID') {
        logger.warn({ signature }, 'Webhook signature verification failed')
        return response.status(403).send('Forbidden')
      }

      logger.error({ err }, 'Webhook processing error — acknowledging to prevent retry loop')
      return response.status(200).send('OK')
    }
  }

  async callback({ request, inertia, logger }: HttpContext) {
    const paymentId = request.input('payment_id') as string | undefined

    if (!paymentId) {
      return inertia.render('payment-callback', {
        success: false,
        title: 'Erreur de paiement',
        message: 'Identifiant de paiement manquant.',
      })
    }

    try {
      const resolved = await this.paymentService.resolvePaymentStatus(paymentId)

      switch (resolved.origin) {
        case 'pending_table':
          return inertia.render('payment-callback', {
            success: null,
            title: 'Traitement en cours…',
            message: 'Votre paiement est en cours de traitement. Merci de patienter.',
            paymentId,
          })

        case 'fleeca_api':
          if (resolved.status === 'payment_successful') {
            return inertia.render('payment-callback', {
              success: true,
              title: 'Paiement réussi !',
              message: `Merci ! Votre paiement de $${resolved.amount.toLocaleString()} a été traité avec succès.`,
              amount: resolved.amount,
            })
          }
          return inertia.render('payment-callback', {
            success: false,
            title: 'Paiement refusé',
            message: "Votre paiement a été refusé ou a échoué. Aucun montant n'a été débité.",
          })

        case 'expired':
          return inertia.render('payment-callback', {
            success: false,
            title: 'Session expirée',
            message: "La session de paiement a expiré. Aucun montant n'a été débité.",
          })

        case 'not_found':
          return inertia.render('payment-callback', {
            success: false,
            title: 'Paiement introuvable',
            message: 'Ce paiement est introuvable.',
          })
      }
    } catch (err) {
      logger.error({ err, paymentId }, 'Payment callback page error')
      return inertia.render('payment-callback', {
        success: false,
        title: 'Erreur technique',
        message: 'Une erreur est survenue lors de la vérification du paiement.',
      })
    }
  }

  async status({ params, response }: HttpContext) {
    const resolved = await this.paymentService.resolvePaymentStatus(params.paymentId)

    switch (resolved.origin) {
      case 'pending_table':
        return response.json({ status: 'pending', amount: resolved.amount })

      case 'fleeca_api':
        return response.json({ status: resolved.status, amount: resolved.amount })

      case 'expired':
        return response.json({ status: 'expired' })

      case 'not_found':
        return response.status(404).json({ status: 'not_found' })
    }
  }
}
