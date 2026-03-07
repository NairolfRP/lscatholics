import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#billing/services/payment_service'
import { FleecaValidationResponse, PaymentResult, PaymentSessionData } from '#billing/types/payment'
import { DonateService } from '#donate/services/donate_service'
import type { Logger } from '@adonisjs/core/logger'
import { DonateMetadata } from '#donate/validators/donate'

@inject()
export default class PaymentsController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly donateService: DonateService
  ) {}

  async callback({ inertia, response, session, params, logger }: HttpContext) {
    try {
      const { token } = params

      if (!token) {
        logger.error(undefined, 'Payment callback received without token')
        return this.handlePaymentError(inertia, {
          title: 'Erreur de paiement',
          message: 'Token de paiement manquant',
        })
      }

      logger.info(`Processing payment callback for token %s`, token)

      try {
        const result = await this.paymentService.processPaymentCallback(token, session)

        await this.handleSuccessfulPayment(result, logger)

        return this.handlePaymentSuccess(response, session, inertia, result.sessionData)
      } catch (err) {
        logger.error({ err }, 'Payment processing failed for token %s', token)
        return this.handlePaymentError(inertia, {
          title: 'Erreur de paiement',
          message: "Le paiement n'a pas pu être vérifié",
        })
      }
    } catch (error) {
      logger.error({ err: error }, 'Payment callback error')
      return this.handlePaymentError(inertia, {
        title: 'Erreur technique',
        message: 'Erreur lors du traitement du paiement',
      })
    }
  }

  private handlePaymentSuccess(
    response: HttpContext['response'],
    session: HttpContext['session'],
    inertia: HttpContext['inertia'],
    sessionData: PaymentSessionData
  ) {
    const { source, amount } = sessionData

    switch (source) {
      case 'donation':
        return inertia.render('payment-callback', {
          //@ts-ignore
          success: true,
          title: 'Donation réussie !',
          message: `Merci pour votre générosité ! Votre don de $${amount} a été traité avec succès.`,
          amount: sessionData.amount,
          source: sessionData.source,
          metadata: sessionData.metadata,
        })
      default:
        session.flash('success', `Votre paiement de $${amount} a été traité avec succès.`)
        return response.redirect().back()
    }
  }

  private handlePaymentError(
    inertia: HttpContext['inertia'],
    error: { title: string; message: string }
  ) {
    return inertia.render('payment-callback', {
      //@ts-ignore
      success: false,
      title: error.title,
      message: error.message,
    })
  }

  private async handleSuccessfulPayment(
    result: PaymentResult<FleecaValidationResponse>,
    logger: Logger
  ): Promise<void> {
    const { sessionData } = result
    logger.debug(
      { source: sessionData.source, amount: sessionData.amount },
      `Processing successful payment`
    )
    switch (sessionData.source) {
      case 'donation':
        const donateMetadata = sessionData.metadata as DonateMetadata
        await Promise.all([
          this.donateService.sendPrivateDonateNotification(donateMetadata),
          this.donateService.sendPublicDonateNotification(donateMetadata),
        ])
        break
      default:
        logger.warn({ source: sessionData.source }, `Unknown payment source`)
        throw new Error(`Unsupported payment source: ${sessionData.source}`)
    }
  }
}
