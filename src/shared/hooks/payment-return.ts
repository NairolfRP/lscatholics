export type PaymentResultStatus = 'payment_successful' | 'payment_failed' | 'expired' | 'not_found'

export const PAYMENT_STATUS_QUERY_PARAM = 'status'

const PAYMENT_RETURN_KEY = 'lscatholics:pending-payment'

interface PendingPaymentReturn {
  returnPath: string
  paymentId: string
}

export function persistPaymentReturn(returnPath: string, paymentId: string): void {
  try {
    window.sessionStorage.setItem(
      PAYMENT_RETURN_KEY,
      JSON.stringify({ returnPath, paymentId } satisfies PendingPaymentReturn)
    )
  } catch {
    // storage can throw in NUI iframes; payment still proceeds via in-app navigation
  }
}

export function consumePaymentReturn(): PendingPaymentReturn | null {
  try {
    const raw = window.sessionStorage.getItem(PAYMENT_RETURN_KEY)
    if (!raw) return null
    window.sessionStorage.removeItem(PAYMENT_RETURN_KEY)

    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return null

    const { returnPath, paymentId } = parsed as PendingPaymentReturn
    if (typeof returnPath !== 'string' || typeof paymentId !== 'string') return null

    return { returnPath, paymentId }
  } catch {
    return null
  }
}

export function buildPaymentResultUrl(returnPath: string, status: PaymentResultStatus): string {
  const separator = returnPath.includes('?') ? '&' : '?'
  return `${returnPath}${separator}${PAYMENT_STATUS_QUERY_PARAM}=${status}`
}
