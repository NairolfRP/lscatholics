import { createFileRoute } from '@tanstack/react-router'
import '#/features/donate/server/donation-payment.handler'
import '#/features/gift-shop/server/gift-shop-payment.handler'
import { paymentService } from '#server/payments/payment.service.ts'

export const Route = createFileRoute('/api/payment/status/$paymentId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const resolved = await paymentService.resolvePaymentStatus(params.paymentId)

        switch (resolved.origin) {
          case 'pending':
            return Response.json({ status: 'pending', amount: resolved.amount })
          case 'fleeca_api':
            return Response.json({ status: resolved.status, amount: resolved.amount })
          case 'expired':
            return Response.json({ status: 'expired' })
          case 'not_found':
            return new Response(JSON.stringify({ status: 'not_found' }), { status: 404 })
        }
      },
    },
  },
})
