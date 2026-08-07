import { useState } from 'react'
import { CircleXIcon } from 'lucide-react'
import { getDonationDefaults } from '#/features/donate/constants/donate-defaults.ts'
import {
  DONATION_MIN_AMOUNT,
  PREDEFINED_AMOUNTS,
} from '#/features/donate/constants/donate.constants.ts'
import { formatNumber } from '#/utils/number.ts'
import { CurrencyField } from '#shared/components/form/currency-field.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import { cn } from '#shared/lib/utils.ts'

interface DonateAmountFieldProps {
  name: string
  value: number | undefined
  isInvalid: boolean
  errors: ({ message?: string } | undefined)[]
  handleChange: (value: number) => void
}

export const DonateAmountSection = withForm({
  defaultValues: getDonationDefaults(null),
  render: ({ form }) => (
    <form.AppField name="amount">
      {(field) => (
        <DonateAmountField
          name={field.name}
          value={field.state.value}
          isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
          errors={field.state.meta.errors}
          handleChange={(value) => field.handleChange(value)}
        />
      )}
    </form.AppField>
  ),
})

function DonateAmountField({
  name,
  value,
  isInvalid,
  errors,
  handleChange,
}: DonateAmountFieldProps) {
  const [showCustomField, setShowCustomField] = useState(false)

  return (
    <Field data-invalid={isInvalid}>
      {showCustomField ? (
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <CurrencyField type="number" label="Montant du don" required autoComplete="off" />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-6 shrink-0"
            aria-label="Revenir aux montants suggérés"
            onClick={() => setShowCustomField(false)}
          >
            <CircleXIcon />
          </Button>
        </div>
      ) : (
        <>
          <FieldContent>
            <FieldLabel required htmlFor={name}>
              Montant du don
            </FieldLabel>
            <FieldDescription>
              Choisissez un montant suggéré ou indiquez le montant de votre choix. Le montant
              minimum est de {formatNumber(DONATION_MIN_AMOUNT)}$.
            </FieldDescription>
          </FieldContent>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PREDEFINED_AMOUNTS.map((amount) => (
              <Button
                key={amount}
                type="button"
                variant="outline"
                className={cn(
                  value != null &&
                    amount === value &&
                    'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                )}
                onClick={() => handleChange(amount)}
              >
                {formatNumber(amount)}$
              </Button>
            ))}
            <Button type="button" variant="outline" onClick={() => setShowCustomField(true)}>
              Autre
            </Button>
          </div>
        </>
      )}

      {!showCustomField && isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}
