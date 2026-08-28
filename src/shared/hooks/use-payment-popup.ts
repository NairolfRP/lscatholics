import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '#/utils/number.ts'
import { toast } from '#shared/components/ui/toast.tsx'

const PAYMENT_WINDOW_CONFIG = {
  width: 800,
  height: 800,
} as const

const PAYMENT_WINDOW_TARGET = 'fleeca-payment'

const STATUS_POLL_INITIAL_MS = 2_000
const STATUS_POLL_MAX_MS = 10_000
const STATUS_POLL_BACKOFF_FACTOR = 2
/** ~15 min polling window (2s → 4s → 8s → … → 10s backoff). */
const STATUS_POLL_DURATION_MS = 15 * 60_000

export type PaymentFailureReason = 'payment_failed' | 'expired' | 'not_found'

interface PaymentStatus {
  status: 'pending' | 'payment_successful' | 'payment_failed' | 'expired'
  amount?: number
}

interface OpenPaymentOptions {
  paymentId: string
  paymentUrl: string
  onSuccess: () => void
  onFailure: (reason: PaymentFailureReason) => void
}

/**
 * Opens the payment in a best-effort popup and tracks the server-side payment
 * status until it reaches a terminal state. The popup is a nice-to-have: if the
 * browser blocks it (e.g. Brave Shields), the caller renders a real link from
 * `blockedPaymentUrl`, which is never blocked. Cart/side effects happen through
 * `onSuccess`/`onFailure` regardless of how the popup was opened.
 */
export function usePaymentPopup() {
  const [blockedPaymentUrl, setBlockedPaymentUrl] = useState<string | null>(null)
  const cancelTrackingRef = useRef<(() => void) | undefined>(undefined)

  useEffect(() => () => cancelTrackingRef.current?.(), [])

  const openPayment = ({ paymentId, paymentUrl, onSuccess, onFailure }: OpenPaymentOptions) => {
    cancelTrackingRef.current?.()

    const popup = createPaymentWindow(paymentUrl)
    if (!popup) {
      setBlockedPaymentUrl(paymentUrl)
    }

    cancelTrackingRef.current = trackPaymentStatus(paymentId, {
      onSuccess,
      onFailure: (reason) => {
        setBlockedPaymentUrl(null)
        onFailure(reason)
      },
    })
  }

  return { openPayment, blockedPaymentUrl }
}

function createPaymentWindow(url: string) {
  const { width, height, left, top } = calculateWindowPosition(
    PAYMENT_WINDOW_CONFIG.width,
    PAYMENT_WINDOW_CONFIG.height
  )

  return window.open(
    url,
    PAYMENT_WINDOW_TARGET,
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,location=no`
  )
}

function calculateWindowPosition(width: number, height: number) {
  const screenLeft = window.screenLeft || window.screenX
  const screenTop = window.screenTop || window.screenY
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height

  return {
    width,
    height,
    left: screenLeft + (screenWidth - width) / 2,
    top: screenTop + (screenHeight - height) / 2,
  }
}

interface TrackPaymentStatusOptions {
  onSuccess: () => void
  onFailure: (reason: PaymentFailureReason) => void
}

function trackPaymentStatus(
  paymentId: string,
  { onSuccess, onFailure }: TrackPaymentStatusOptions
): () => void {
  let cancelled = false
  let pollIntervalMs = STATUS_POLL_INITIAL_MS
  const startedAt = Date.now()

  const done = (status: 'payment_successful' | PaymentFailureReason, amount?: number) => {
    if (status === 'payment_successful') {
      toast.add({
        type: 'success',
        title: 'Paiement réussi !',
        description:
          amount !== undefined
            ? `Votre paiement de ${formatCurrency(amount)} a été traité.`
            : undefined,
      })
      onSuccess()
      return
    }

    if (status === 'payment_failed') {
      toast.add({ type: 'error', title: 'Paiement refusé' })
    } else if (status === 'expired') {
      toast.add({
        type: 'warning',
        title: 'Session de paiement expirée',
        description: "Vérifiez l'état du paiement dans votre espace Fleeca avant de réessayer.",
      })
    } else {
      toast.add({ type: 'warning', title: 'Paiement introuvable' })
    }
    onFailure(status)
  }

  const schedule = () => {
    if (cancelled) return
    if (Date.now() - startedAt >= STATUS_POLL_DURATION_MS) {
      done('expired')
      return
    }
    pollIntervalMs = Math.min(pollIntervalMs * STATUS_POLL_BACKOFF_FACTOR, STATUS_POLL_MAX_MS)
    window.setTimeout(poll, pollIntervalMs)
  }

  const poll = async () => {
    if (cancelled) return
    try {
      const response = await fetch(`/api/payment/status/${paymentId}`)

      if (response.status === 404) {
        done('not_found')
        return
      }

      if (!response.ok) {
        schedule()
        return
      }

      const data = (await response.json()) as PaymentStatus

      switch (data.status) {
        case 'payment_successful':
          done('payment_successful', data.amount)
          return
        case 'payment_failed':
          done('payment_failed', data.amount)
          return
        case 'expired':
          done('expired')
          return
        default:
          schedule()
      }
    } catch {
      schedule()
    }
  }

  void poll()

  return () => {
    cancelled = true
  }
}
