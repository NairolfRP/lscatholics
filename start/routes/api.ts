import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.post('/fleeca/webhook', [controllers.billing.Payments, 'webhook']).as('payment.webhook')

    router
      .get('/fleeca/callback', [controllers.billing.Payments, 'callback'])
      .as('payment.callback')

    router.get('/status/:paymentId', [controllers.billing.Payments, 'status']).as('payment.status')
  })
  .prefix('/api/payment')
