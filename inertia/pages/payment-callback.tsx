import type { InertiaProps } from '@/shared/types/pages'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type PaymentStatus = 'payment_successful' | 'payment_failed' | 'pending' | 'expired'

type StatusApiResponse = {
  status: PaymentStatus
  amount?: number
}

type PageProps = InertiaProps<{
  success: boolean | null
  title: string
  message: string
  amount?: number
  source?: string
  metadata?: Record<string, any>
  paymentId?: string
}>

const POLL_INITIAL_INTERVAL_MS = 2_000
const POLL_MAX_INTERVAL_MS = 30_000
const POLL_BACKOFF_FACTOR = 2
const POLL_MAX_ATTEMPTS = 10

export default function PaymentCallbackPage({
  success: initialSuccess,
  title: initialTitle,
  message: initialMessage,
  amount: initialAmount,
  source,
  metadata,
  paymentId,
}: PageProps) {
  const [success, setSuccess] = useState(initialSuccess)
  const [title, setTitle] = useState(initialTitle)
  const [message, setMessage] = useState(initialMessage)
  const [amount, setAmount] = useState(initialAmount)
  const [countdown, setCountdown] = useState(3)

  const pollCountRef = useRef(0)
  const currentIntervalRef = useRef(POLL_INITIAL_INTERVAL_MS)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isPending = success === null

  useEffect(() => {
    if (!isPending || !paymentId) return

    let cancelled = false

    const poll = async () => {
      if (cancelled) return

      pollCountRef.current += 1

      if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
        setSuccess(false)
        setTitle('Délai dépassé')
        setMessage(
          'Le traitement prend plus de temps que prévu. ' +
            'Vérifiez votre historique Fleeca ou contactez-nous si le montant a été débité.'
        )
        return
      }

      try {
        const res = await fetch(`/api/payment/status/${paymentId}`)

        if (res.status === 429) {
          scheduleNext()
          return
        }

        if (!res.ok) {
          scheduleNext()
          return
        }

        const data: StatusApiResponse = await res.json()

        if (data.status === 'payment_successful') {
          setSuccess(true)
          setTitle('Paiement réussi !')
          setAmount(data.amount)
          setMessage(
            `Merci ! Votre paiement de $${data.amount?.toLocaleString()} a été traité avec succès.`
          )
          return
        }

        if (data.status === 'payment_failed') {
          setSuccess(false)
          setTitle('Paiement refusé')
          setMessage("Votre paiement a été refusé ou a échoué. Aucun montant n'a été débité.")
          return
        }

        if (data.status === 'expired') {
          setSuccess(false)
          setTitle('Session expirée')
          setMessage("La session de paiement a expiré. Aucun montant n'a été débité.")
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
      timeoutRef.current = setTimeout(poll, currentIntervalRef.current)
    }

    timeoutRef.current = setTimeout(poll, POLL_INITIAL_INTERVAL_MS)

    return () => {
      cancelled = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPending, paymentId])

  useEffect(() => {
    if (success === null) return

    const isPopup = window.opener && window.opener !== window

    if (isPopup) {
      window.opener.postMessage(
        success
          ? { type: 'PAYMENT_SUCCESS', title, message, amount, source, metadata }
          : { type: 'PAYMENT_ERROR', title, message },
        window.location.origin
      )
    }

    const close = () => {
      if (isPopup) window.close()
      else window.location.href = '/'
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          close()
          return 0
        }
        return c - 1
      })
    }, 1_000)

    return () => clearInterval(timer)
  }, [success, title, message, amount, source, metadata])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="text-6xl" role="img">
            {isPending ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : success ? (
              '🎉'
            ) : (
              '❌'
            )}
          </div>
          <h2
            className={cn('text-2xl font-bold', {
              'text-yellow-600': isPending,
              'text-green-600': success === true,
              'text-red-600': success === false,
            })}
          >
            {title}
          </h2>
          <p className="text-gray-600">{message}</p>
          {isPending && (
            <p className="text-xs text-gray-400 animate-pulse">Vérification en cours…</p>
          )}
          {!isPending && (
            <p className="text-sm text-gray-500">
              Fermeture automatique dans{' '}
              <span className="font-mono font-semibold">{countdown}</span>s…
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
