import { HandHeartIcon } from 'lucide-react'
import { DonateFormSkeleton } from '#/features/donate/components/donate-form-skeleton.tsx'
import {
  DonateAddressSection,
} from '#/features/donate/components/sections/donate-address-section.tsx'
import {
  DonateAmountSection,
} from '#/features/donate/components/sections/donate-amount-section.tsx'
import {
  DonateIdentitySection,
} from '#/features/donate/components/sections/donate-identity-section.tsx'
import {
  DonateOptionsSection,
} from '#/features/donate/components/sections/donate-options-section.tsx'
import { getDonationDefaults } from '#/features/donate/constants/donate-defaults.ts'
import { usePaymentPopup } from '#/features/donate/hooks/use-payment-popup.ts'
import type { DonationInput } from '#/features/donate/schemas/donate.schema.ts'
import { donationSchema } from '#/features/donate/schemas/donate.schema.ts'
import { initiateDonationFn } from '#/features/donate/server-fn/donation.functions.ts'
import { formatNumber } from '#/utils/number.ts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export function DonateForm() {
  const { currentCharacter, isLoading } = useGameContext()
  const { openPayment } = usePaymentPopup()

  const form = useAppForm({
    formId: 'donation-submission-form',
    validators: {
      onChange: donationSchema,
      onSubmit: donationSchema,
    },
    defaultValues: getDonationDefaults(currentCharacter),
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await initiateDonationFn({ data: value })

        if (!result.success) {
          if (result.validationErrors) {
            return formApi.setErrorMap({
              onServer: {
                fields: result.validationErrors,
              },
            } as unknown as Parameters<typeof formApi.setErrorMap>[0])
          }

          return toast.add({
            type: 'error',
            title: result.error || 'Une erreur est survenue',
          })
        }

        if (!result.paymentUrl) {
          return toast.add({
            type: 'error',
            title: 'Échec',
            description: "Impossible de récupérer l'URL pour le paiement",
          })
        }

        openPayment(result.paymentUrl, () => formApi.reset())
      } catch {
        toast.add({ type: 'error', title: 'Une erreur est survenue' })
      }
    },
  })

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Faire un don</CardTitle>
        <CardDescription>
          Votre générosité contribue à la mission de l'Église et au soutien des plus démunis. Seuls
          les champs marqués d'un astérisque sont obligatoires.
        </CardDescription>
      </CardHeader>
      {isLoading ? (
        <DonateFormSkeleton />
      ) : (
        <form
          id={form.formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="contents"
        >
          <CardContent>
            <FieldGroup>
              <DonateAmountSection form={form} />
              <DonateIdentitySection form={form} currentCharacter={currentCharacter} />
              <DonateAddressSection form={form} />
              <DonateOptionsSection form={form} />
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <form.AppForm>
              <form.SubmitButton
                label={(state) => {
                  const { values } = state as { values: DonationInput }
                  return values.amount ? (
                    <>
                      <HandHeartIcon /> Donner {formatNumber(values.amount)}$
                    </>
                  ) : (
                    <>
                      <HandHeartIcon /> Faire un don
                    </>
                  )
                }}
                submittingLabel="Attente du paiement..."
                size="lg"
              />
            </form.AppForm>
          </CardFooter>
        </form>
      )}
    </Card>
  )
}
