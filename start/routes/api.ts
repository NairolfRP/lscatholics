import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

router
  .get('/api/payment/fleeca/callback/:token', [controllers.billing.Payments, 'callback'])
  .as('payment.callback')
