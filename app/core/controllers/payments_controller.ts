import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { PaymentService } from '#core/services/payment_service'
import { PaymentSessionData } from '#core/types/payment'

@inject()
export default class PaymentsController {
  constructor(private paymentService: PaymentService) {}

  async callback({ response, session, params, logger }: HttpContext) {
    try {
      const { token } = params

      if (!token) {
        logger.error(undefined, 'Payment callback received without token')
        return this.handlePaymentError(response, session, {
          type: 'missing_token',
          message: 'Token de paiement manquant',
        })
      }

      logger.info({ token }, `Processing payment callback for token`)

      const result = await this.paymentService.processPaymentCallback(token, session)

      if (!result.success) {
        logger.error({ token }, 'Payment processing failed for token')
        return this.handlePaymentError(response, session, {
          type: 'validation_failed',
          message: "Le paiement n'a pas pu être vérifié",
        })
      }

      await this.handleSuccessfulPayment(result)

      return this.handlePaymentSuccess(response, session, result.sessionData)
    } catch (error) {
      logger.error({ error }, 'Payment callback error')
      return this.handlePaymentError(response, session, {
        type: 'processing_error',
        message: 'Erreur lors du traitement du paiement',
      })
    }
  }

  private handlePaymentSuccess(response: any, session: any, sessionData: PaymentSessionData) {
    const { source, amount } = sessionData

    switch (source) {
      case 'donation':
        session.flash(
          'success',
          `Merci pour votre générosité ! Votre don de $${amount} a été traité avec succès.`
        )
        return response.redirect().back()
      default:
        session.flash('success', `Votre paiement de $${amount} a été traité avec succès.`)
        return response.redirect().back()
    }
  }

  private handlePaymentError(response: any, session: any, error: any) {
    session.flashErrors({
      E_PAYMENT: this.getErrorMessage(error.type),
    })
    return response.redirect().back()
  }

  private getErrorMessage(errorType: string): string {
    const errorMessages: Record<string, string> = {
      missing_token: 'Échec. Le jeton de paiement est manquant.',
      validation_failed: 'Échec. Impossible de valider le paiement.',
      processing_error: 'Échec. Une erreur est survenue.',
      session_expired: 'Échec. Votre session de paiement a expiré.',
      amount_mismatch: 'Échec. Une erreur est survenue (montant de paiement invalide).',
      invalid_token: 'Échec. Jeton de paiement invalide ou expiré.',
    }

    return errorMessages[errorType] || "Échec. Une erreur inattendue s'est produite."
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

  private async processDonation(sessionData: any, transactionData: any): Promise<void> {
    console.log('Processing donation:', {
      amount: sessionData.amount,
      sessionId: sessionData.sessionId,
      metadata: sessionData.metadata,
      fleecaToken: transactionData.token,
    })
  }
}
