import type { InertiaProps } from '@/types'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type PageProps = InertiaProps<{
  success: boolean
  title: string
  message: string
  amount?: number
  source?: string
  metadata?: Record<string, any>
}>

export default function PaymentCallbackPage({
  success,
  title,
  message,
  amount,
  source,
  metadata,
}: PageProps) {
  const [countdown, setCountdown] = useState<number>(3)

  useEffect(() => {
    const closePopup = () => {
      if (window.opener && window.opener !== window) {
        window.close()
      } else {
        window.location.href = '/'
      }
    }

    if (window.opener && window.opener !== window) {
      window.opener.postMessage(
        success
          ? { type: 'PAYMENT_SUCCESS', title, message, amount, source, metadata }
          : { type: 'PAYMENT_ERROR', title, message },
        window.location.origin
      )
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          closePopup()
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [amount, message, metadata, source, success, title])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="space-y-4">
          <div className="text-6xl">{success ? '🎉' : '❌'}</div>
          <h2
            className={cn('text-2xl font-bold', {
              'text-green-600': success,
              'text-red-600': !success,
            })}
          >
            {title}
          </h2>
          <p className="text-gray-600">{message}</p>
          <div className="text-sm text-gray-500">
            Fermeture automatique dans <span className="font-mono">{countdown}</span>s...
          </div>
        </div>
      </div>
    </div>
  )
}
