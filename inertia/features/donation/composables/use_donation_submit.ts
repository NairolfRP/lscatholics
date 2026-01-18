import { router } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { tuyau } from '@/lib/tuyau'
import { DonationFormValues } from '@/features/donation/types/donation.types'

export function useDonationSubmit(setErrors: (errors: any) => void, resetForm: () => void) {
  const submitDonation = (
    formValues: DonationFormValues,
    openPayment: (url: string, onSuccess: () => void) => void
  ) => {
    router.post(tuyau.donate.$url(), formValues, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: (page) => {
        const paymentUrl = page?.props?.paymentUrl as string | undefined
        if (!paymentUrl) {
          return toast.error('Échec', {
            description: "Impossible de récupérer l'URL pour le paiement",
          })
        }
        openPayment(paymentUrl, resetForm)
      },
      onError: (err) => {
        handleSubmitError(err, setErrors)
      },
    })
  }

  return { submitDonation }
}

function handleSubmitError(err: any, setErrors: (errors: any) => void) {
  if (!err) return

  if (!('E_DONATE_ERROR' in err)) {
    setErrors(err)
    return toast.error('Champs invalides', {
      description: 'Veuillez corriger les erreurs dans le formulaire',
    })
  }

  toast.error('Échec', { description: err.E_DONATE_ERROR })
}
