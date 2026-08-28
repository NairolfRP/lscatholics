import { toast } from '#shared/components/ui/toast.tsx'

const PAYMENT_POPUP_CONFIG = {
  width: 800,
  height: 800,
  timeoutMs: 15 * 60 * 1000,
  closeCheckIntervalMs: 1000,
} as const

const PAYMENT_POPUP_TARGET = 'fleeca-payment'

/**
 * Popup opened synchronously during the user gesture (submit click). It starts
 * as a blank splash and is redirected to the payment URL once it is available,
 * because a delayed `window.open` is blocked by the browser in production.
 */
let preparedPopup: Window | null = null

export function usePaymentPopup() {
  const openPayment = (paymentUrl: string, onSuccess: () => void) => {
    const popup = preparedPopup && !preparedPopup.closed ? preparedPopup : null
    preparedPopup = null

    if (!popup) {
      toast.add({
        type: 'error',
        title: 'Popup bloquée',
        description: 'Veuillez autoriser les popups pour ce site.',
      })
      return
    }

    popup.location.href = paymentUrl
    setupPaymentHandlers(popup, onSuccess)
    setupAutoCloseTimer(popup)
  }

  const preparePaymentPopup = () => {
    const popup = preparedPopup && !preparedPopup.closed ? preparedPopup : createPaymentWindow()
    if (!popup) return
    preparedPopup = popup
    renderPaymentPlaceholder(popup)
  }

  const disposePaymentPopup = () => {
    if (preparedPopup && !preparedPopup.closed) {
      preparedPopup.close()
    }
    preparedPopup = null
  }

  return { openPayment, preparePaymentPopup, disposePaymentPopup }
}

function createPaymentWindow() {
  const { width, height, left, top } = calculateWindowPosition(
    PAYMENT_POPUP_CONFIG.width,
    PAYMENT_POPUP_CONFIG.height
  )

  return window.open(
    'about:blank',
    PAYMENT_POPUP_TARGET,
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,location=no`
  )
}

function renderPaymentPlaceholder(popup: Window) {
  try {
    popup.document.open()
    popup.document.write(`
      <!doctype html>
      <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <title>Paiement…</title>
          <style>
            html, body { height: 100%; margin: 0; }
            body {
              display: flex; align-items: center; justify-content: center;
              font-family: system-ui, sans-serif; color: #333;
            }
            .message { padding: 1.5rem; text-align: center; }
          </style>
        </head>
        <body>
          <div class="message">Préparation du paiement…</div>
        </body>
      </html>
    `)
    popup.document.close()
  } catch {
    // The popup already navigated (or is unreachable): leave it as is.
  }
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

interface PaymentPopupMessage {
  type?: string
  title?: string
  message?: string
  amount?: number
}

function setupPaymentHandlers(popup: Window, onSuccess: () => void) {
  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    const data = event.data as PaymentPopupMessage | null

    if (data?.type === 'PAYMENT_SUCCESS') {
      handlePaymentSuccess(data, popup, messageHandler, onSuccess)
    } else if (data?.type === 'PAYMENT_ERROR') {
      handlePaymentError(data, popup, messageHandler)
    }
  }

  window.addEventListener('message', messageHandler)
  setupPopupCloseDetection(popup, messageHandler)
}

function handlePaymentSuccess(
  data: PaymentPopupMessage,
  popup: Window,
  handler: (e: MessageEvent) => void,
  onSuccess: () => void
) {
  toast.add({
    type: 'success',
    title: data.title || 'Paiement réussi !',
    description: data.message,
  })
  popup.close()
  window.removeEventListener('message', handler)
  onSuccess()
}

function handlePaymentError(
  data: PaymentPopupMessage,
  popup: Window,
  handler: (e: MessageEvent) => void
) {
  toast.add({
    type: 'error',
    title: data.title || 'Erreur de paiement',
    description: data.message || 'Une erreur est survenue lors du paiement',
  })
  popup.close()
  window.removeEventListener('message', handler)
}

function setupPopupCloseDetection(popup: Window, handler: (e: MessageEvent) => void) {
  const checkClosed = window.setInterval(() => {
    if (popup.closed) {
      window.clearInterval(checkClosed)
      window.removeEventListener('message', handler)
    }
  }, PAYMENT_POPUP_CONFIG.closeCheckIntervalMs)
}

function setupAutoCloseTimer(popup: Window) {
  window.setTimeout(() => {
    if (!popup.closed) {
      popup.close()
      toast.add({ type: 'warning', title: 'Session de paiement expirée' })
    }
  }, PAYMENT_POPUP_CONFIG.timeoutMs)
}
