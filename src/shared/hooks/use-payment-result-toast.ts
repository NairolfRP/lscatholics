import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from '#shared/components/ui/toast.tsx'
import { PAYMENT_STATUS_QUERY_PARAM } from '#shared/hooks/payment-return.ts'
import type { PaymentResultStatus } from '#shared/hooks/payment-return.ts'

const PAYMENT_RESULT_TOAST_MESSAGES: Record<
  PaymentResultStatus,
  { type: 'success' | 'error' | 'warning'; title: string }
> = {
  payment_successful: { type: 'success', title: 'Paiement réussi !' },
  payment_failed: { type: 'error', title: 'Paiement refusé' },
  expired: { type: 'warning', title: 'Session de paiement expirée' },
  not_found: { type: 'warning', title: 'Paiement introuvable' },
}

function isPaymentResultStatus(value: string): value is PaymentResultStatus {
  return value in PAYMENT_RESULT_TOAST_MESSAGES
}

export function usePaymentResultToast(): void {
  const navigate = useNavigate()
  const location = useLocation()
  const hasHandledRef = useRef(false)

  useEffect(() => {
    if (hasHandledRef.current) return

    const status = (location.search as Record<string, unknown>)[PAYMENT_STATUS_QUERY_PARAM]
    if (typeof status !== 'string' || !isPaymentResultStatus(status)) return

    toast.add(PAYMENT_RESULT_TOAST_MESSAGES[status])

    hasHandledRef.current = true
    void navigate({ to: '.', search: {}, replace: true })
  }, [location.search, navigate])
}