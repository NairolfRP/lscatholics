import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#core/services/payment_service'
import { PaymentSessionData } from '#core/types/payment'
import { DonateService } from '#pages/services/donate_service'

@inject()
export default class PaymentsController {
  constructor(private paymentService: PaymentService) {}

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

        await this.handleSuccessfulPayment(result)

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
      success: false,
      error: error.message,
      title: error.title,
    })
  }

  private async handleSuccessfulPayment(result: any): Promise<void> {
    const { sessionData } = result
    console.log(`Processing successful payment: ${sessionData.source} - $${sessionData.amount}`)

    try {
      switch (sessionData.source) {
        case 'donation':
          await this.processDonation(sessionData, result.transactionData)
          break
        default:
          console.warn(`Unknown payment source: ${sessionData.source}`)
      }
    } catch (error) {
      console.error('Error handling successful payment:', error)
    }
  }

  private async processDonation(sessionData: any, _transactionData: any): Promise<void> {
    try {
      const discordService = new DonateService()

      const promises: Promise<any>[] = [
        discordService.sendPrivateDonateNotification(sessionData.metadata),
        discordService.sendPublicDonateNotification(sessionData.metadata),
      ]

      await Promise.all(promises)
    } catch (error) {
      throw error
    }
  }
}
