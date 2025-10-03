import router from '@adonisjs/core/services/router'

const PaymentController = () => import('#core/controllers/payments_controller')

router
  .get('/api/payment/fleeca/callback/:token', [PaymentController, 'callback'])
  .as('payment.callback')
