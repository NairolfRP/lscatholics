import { useEffect, useRef, useState } from 'react'
import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { cn } from '#shared/lib/utils.ts'
import { formatDonationAmount } from '#/features/donate/utils/format.ts'

type PaymentStatus = 'payment_successful' | 'payment_failed' | 'pending' | 'expired' | 'not_found'

interface StatusApiResponse {
  status: PaymentStatus
  amount?: number
}

const POLL_INITIAL_INTERVAL_MS = 1_000
const POLL_MAX_INTERVAL_MS = 10_000
const POLL_BACKOFF_FACTOR = 2
/** ~3 min total polling window (1s → 2s → … → 10s backoff) before declaring expired. */
const POLL_MAX_ATTEMPTS = 20

export function PaymentCallbackPage() {
  const { payment_id: paymentId } = useSearch({ from: '/api/payment/fleeca/callback' })
  const [status, setStatus] = useState<PaymentStatus>(paymentId ? 'pending' : 'not_found')
  const [amount, setAmount] = useState<number>()
  const [countdown, setCountdown] = useState(3)

  const pollCountRef = useRef(0)
  const currentIntervalRef = useRef(POLL_INITIAL_INTERVAL_MS)

  const isPending = status === 'pending'

  useEffect(() => {
    if (!isPending || !paymentId) return

    let cancelled = false

    const poll = async () => {
      if (cancelled) return

      pollCountRef.current += 1

      if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
        setStatus('expired')
        return
      }

      try {
        const res = await fetch(`/api/payment/status/${paymentId}`)

        if (!res.ok) {
          if (res.status === 404) {
            setStatus('not_found')
            return
          }
          scheduleNext()
          return
        }

        const data: StatusApiResponse = await res.json()

        if (
          data.status === 'payment_successful' ||
          data.status === 'payment_failed' ||
          data.status === 'expired'
        ) {
          setStatus(data.status)
          setAmount(data.amount)
          return
        }

        scheduleNext()
      } catch {
        scheduleNext()
      }
    }

    const scheduleNext = () => {
      if (cancelled) return
      currentIntervalRef.current = Math.min(
        currentIntervalRef.current * POLL_BACKOFF_FACTOR,
        POLL_MAX_INTERVAL_MS
      )
      window.setTimeout(poll, currentIntervalRef.current)
    }

    window.setTimeout(poll, POLL_INITIAL_INTERVAL_MS)

    return () => {
      cancelled = true
    }
  }, [isPending, paymentId])

  useEffect(() => {
    if (isPending) return

    const isPopup = window.opener && window.opener !== window

    if (isPopup) {
      window.opener.postMessage(
        status === 'payment_successful'
          ? {
              type: 'PAYMENT_SUCCESS',
              title: 'Paiement réussi !',
              message: getMessage(status, amount),
              amount,
            }
          : { type: 'PAYMENT_ERROR', title: getTitle(status), message: getMessage(status, amount) },
        window.location.origin
      )
    }

    const close = () => {
      if (isPopup) window.close()
      else window.location.href = '/'
    }

    const timer = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(timer)
          close()
          return 0
        }
        return c - 1
      })
    }, 1_000)

    return () => window.clearInterval(timer)
  }, [isPending, status, amount])

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="text-6xl" role="img" aria-label={getTitle(status)}>
            <span aria-hidden="true">
              {isPending ? (
                <span className="inline-block animate-spin">⏳</span>
              ) : status === 'payment_successful' ? (
                '🎉'
              ) : (
                '❌'
              )}
            </span>
          </div>
          <CardTitle className="mt-2 text-2xl font-bold">{getTitle(status)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="text-base">{getMessage(status, amount)}</CardDescription>
          {isPending && (
            <Typography className="animate-pulse text-xs text-muted-foreground">
              Vérification en cours…
            </Typography>
          )}
          {!isPending && (
            <Typography className={cn('text-sm text-muted-foreground')}>
              Fermeture automatique dans{' '}
              <span className="font-mono font-semibold">{countdown}</span>s…
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function getTitle(status: PaymentStatus): string {
  switch (status) {
    case 'payment_successful':
      return 'Paiement réussi !'
    case 'payment_failed':
      return 'Paiement refusé'
    case 'expired':
      return 'Session expirée'
    case 'not_found':
      return 'Paiement introuvable'
    default:
      return 'Traitement en cours…'
  }
}

function getMessage(status: PaymentStatus, amount?: number): string {
  const formattedAmount = typeof amount === 'number' ? formatDonationAmount(amount) : ''

  switch (status) {
    case 'payment_successful':
      return `Merci ! Votre paiement de ${formattedAmount} a été traité avec succès.`
    case 'payment_failed':
      return "Votre paiement a été refusé ou a échoué. Aucun montant n'a été débité."
    case 'expired':
      return "La session de paiement a expiré avant la confirmation de la banque. Vérifiez votre espace Fleeca pour connaître l'état réel du paiement avant de réessayer."
    case 'not_found':
      return 'Ce paiement est introuvable.'
    default:
      return 'Votre paiement est en cours de traitement. Merci de patienter.'
  }
}
