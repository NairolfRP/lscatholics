import { toast } from 'sonner'

export function usePaymentPopup() {
  const openPayment = (paymentUrl: string, onSuccess: () => void) => {
    const popup = createPaymentWindow(paymentUrl)

    if (!popup) {
      toast.error('Popup bloquée. Veuillez autoriser les popups pour ce site.')
      return
    }

    setupPaymentHandlers(popup, onSuccess)
    setupAutoCloseTimer(popup)
  }

  return { openPayment }
}

function createPaymentWindow(url: string) {
  const { width, height, left, top } = calculateWindowPosition(800, 800)

  return window.open(
    url,
    'fleeca-payment',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,location=no`
  )
}

function calculateWindowPosition(width: number, height: number) {
  const screenLeft = window.screenLeft ?? window.screenX
  const screenTop = window.screenTop ?? window.screenY
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height

  return {
    width,
    height,
    left: screenLeft + (screenWidth - width) / 2,
    top: screenTop + (screenHeight - height) / 2,
  }
}

function setupPaymentHandlers(popup: Window, onSuccess: () => void) {
  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    if (event.data.type === 'PAYMENT_SUCCESS') {
      handlePaymentSuccess(event.data, popup, messageHandler, onSuccess)
    } else if (event.data.type === 'PAYMENT_ERROR') {
      handlePaymentError(event.data, popup, messageHandler)
    }
  }

  window.addEventListener('message', messageHandler)
  setupPopupCloseDetection(popup, messageHandler)
}

function handlePaymentSuccess(
  data: any,
  popup: Window,
  handler: (e: MessageEvent) => void,
  onSuccess: () => void
) {
  toast.success(data.title || 'Paiement réussi !', {
    description: data.message,
    duration: 6000,
  })
  popup.close()
  window.removeEventListener('message', handler)
  onSuccess()
}

function handlePaymentError(data: any, popup: Window, handler: (e: MessageEvent) => void) {
  toast.error('Erreur de paiement', {
    description: data.message || 'Une erreur est survenue lors du paiement',
    duration: 8000,
  })
  popup.close()
  window.removeEventListener('message', handler)
}

function setupPopupCloseDetection(popup: Window, handler: (e: MessageEvent) => void) {
  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed)
      window.removeEventListener('message', handler)
    }
  }, 1000)
}

function setupAutoCloseTimer(popup: Window) {
  setTimeout(
    () => {
      if (!popup.closed) {
        popup.close()
        toast.warning('Session de paiement expirée')
      }
    },
    15 * 60 * 1000
  )
}
