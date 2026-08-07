import { createFileRoute } from '@tanstack/react-router'
import { PaymentCallbackPage } from '#/features/donate/components/payment-callback.tsx'

export const Route = createFileRoute('/api/payment/fleeca/callback')({
  validateSearch: (search: Record<string, unknown>) => ({
    payment_id: typeof search.payment_id === 'string' ? search.payment_id : undefined,
  }),
  component: PaymentCallbackPage,
})
