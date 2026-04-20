import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { FieldGroup } from '@/shared/components/ui/field'
import { useAppForm } from '@/shared/hooks/form'
import { donateFormOpts } from '@/features/donate/constants/form_opts'
import { useCurrentCharacter } from '@/shared/hooks/use_current_character'
import { urlFor } from '@/client'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import { formatCurrency, serverErrorsFormConvertor } from '@/lib/utils'
import { usePaymentPopup } from '@/features/donate/hooks/use_payment_popup'
import { Button } from '@/shared/components/ui/button'
import AmountField from '@/shared/components/fields/money-input'
import { PREDEFINED_AMOUNTS } from '@/features/donate/constants/donate.constants'
import { DonatePersonalInfoFields } from '@/features/donate/components/form/fields/donate-personal-info-fields'
import { DonateAddressFields } from '@/features/donate/components/form/fields/donate-address-fields'
import { DonateOptionsFields } from '@/features/donate/components/form/fields/donate-options-fields'
import { Separator } from '@/shared/components/ui/separator'

export function DonateForm() {
  const currentCharacter = useCurrentCharacter()

  const { openPayment } = usePaymentPopup()

  const form = useAppForm({
    ...donateFormOpts(currentCharacter?.firstname, currentCharacter?.lastname),
    onSubmit: ({ value }) => {
      router.post(urlFor('donate.submit'), value, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          const paymentUrl = page?.props?.paymentUrl as string | undefined
          if (!paymentUrl) {
            return toast.error('Échec', {
              description: "Impossible de récupérer l'URL pour le paiement",
            })
          }
          openPayment(paymentUrl, form.reset)
        },
        onError: (err) => {
          form.setErrorMap({
            onSubmit: serverErrorsFormConvertor(err),
          })
        },
      })
    },
  })

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold"> Faire un don </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form id="donate-form" onSubmit={onSubmit}>
          <FieldGroup>
            <form.AppField name="amount">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <AmountField
                    name={field.name}
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v)}
                    label="Montant du don"
                    predefinedAmounts={PREDEFINED_AMOUNTS}
                    currency="USD"
                    locale="fr-FR"
                    isInvalid={isInvalid}
                    errors={field.state.meta.errors}
                    required
                  />
                )
              }}
            </form.AppField>

            <Separator />

            <FieldGroup className="space-y-4">
              <DonatePersonalInfoFields form={form} characterId={currentCharacter?.id} />
              <DonateAddressFields form={form} />
            </FieldGroup>

            <Separator />

            <DonateOptionsFields form={form} />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="pt-6">
        <form.Subscribe
          selector={(state) => ({ isSubmitting: state.isSubmitting, amount: state.values.amount })}
        >
          {({ isSubmitting, amount }) => (
            <Button type="submit" form="donate-form" className="w-full" disabled={isSubmitting}>
              Donner {amount && amount > 0 ? formatCurrency(amount) : null}
            </Button>
          )}
        </form.Subscribe>
      </CardFooter>
    </Card>
  )
}
