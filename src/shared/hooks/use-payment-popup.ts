import { toast } from '#shared/components/ui/toast.tsx'

const PAYMENT_POPUP_CONFIG = {
  width: 800,
  height: 800,
  timeoutMs: 15 * 60 * 1000,
  closeCheckIntervalMs: 1000,
} as const

export function usePaymentPopup() {
  const openPayment = (paymentUrl: string, onSuccess: () => void) => {
    const popup = createPaymentWindow(paymentUrl)

    if (!popup) {
      toast.add({
        type: 'error',
        title: 'Popup bloquée',
        description: 'Veuillez autoriser les popups pour ce site.',
      })
      return
    }

    setupPaymentHandlers(popup, onSuccess)
    setupAutoCloseTimer(popup)
  }

  return { openPayment }
}

function createPaymentWindow(url: string) {
  const { width, height, left, top } = calculateWindowPosition(
    PAYMENT_POPUP_CONFIG.width,
    PAYMENT_POPUP_CONFIG.height
  )

  return window.open(
    url,
    'fleeca-payment',
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
