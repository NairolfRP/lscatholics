import { createFileRoute } from '@tanstack/react-router'
import '#/features/donate/server/donation-payment.handler'
import { paymentService } from '#server/payments/payment.service.ts'

export const Route = createFileRoute('/api/payment/fleeca/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rawBody = await request.text()
        const signature = request.headers.get('X-Fleeca-Signature') ?? ''
        const result = await paymentService.processWebhook({ rawBody, signature })
        return new Response(result.body, { status: result.status })
      },
    },
  },
})
