import { type ReactNode, useState } from 'react'
import { CircleX } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { cn } from '@/lib/utils'

type Props = {
  name: string
  label?: string
  description?: ReactNode
  value?: number
  onChange?: (value: number) => void
  isInvalid?: boolean
  errors: Array<{ message?: string } | undefined>
  predefinedAmounts?: number[]
  minAmount?: number
  maxAmount?: number
  currency?: string
  locale?: string
  selectedClass?: string
  gridCols?: number
  required?: boolean
}

export default function AmountField({
  name,
  label = 'Montant',
  description,
  value,
  onChange,
  isInvalid = false,
  errors = [],
  predefinedAmounts = [100000, 50000, 20000, 10000, 5000],
  minAmount = 0,
  maxAmount,
  currency = 'USD',
  locale = 'fr-FR',
  selectedClass = 'bg-blue-50 border-blue-500 text-blue-700',
  gridCols = 4,
  required,
}: Props) {
  const [showCustomField, setShowCustomField] = useState(false)

  const gridClass = `grid grid-cols-2 sm:grid-cols-${gridCols} gap-2 mb-4`

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      maximumSignificantDigits: 2,
    })
      .format(amount)
      .replace('US', '')
      .trim()
  }

  const handleAmountChange = (val: number | null) => {
    onChange?.(val ?? 0)
  }

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel required={required} htmlFor={name}>
          {label}
        </FieldLabel>
      )}

      {showCustomField ? (
        <div className="mt-1">
          <div className="flex justify-between">
            <NumberField
              id={name}
              name={name}
              min={minAmount}
              max={maxAmount}
              formatOptions={{
                style: 'currency',
                currency: currency,
                currencyDisplay: 'code',
                currencySign: 'accounting',
              }}
              value={value}
              onChange={(val) => handleAmountChange(val)}
              aria-invalid={isInvalid}
              className="w-full"
              required={required}
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <Button
              variant="ghost"
              className="px-2 cursor-pointer hover:bg-transparent"
              size="icon"
              type="button"
              onClick={() => setShowCustomField(false)}
            >
              <CircleX className="size-6 text-muted-foreground" />
            </Button>
          </div>
        </div>
      ) : (
        <div className={gridClass}>
          {predefinedAmounts.map((prefAmount) => (
            <Button
              key={prefAmount}
              type="button"
              variant="outline"
              className={cn(prefAmount === value && selectedClass)}
              onClick={() => onChange?.(prefAmount)}
            >
              {formatCurrency(prefAmount)}
            </Button>
          ))}
          <Button type="button" variant="outline" onClick={() => setShowCustomField(true)}>
            Autre
          </Button>
        </div>
      )}

      {description && <FieldDescription>{description}</FieldDescription>}

      {isInvalid && <FieldError errors={errors} />}
    </Field>
  )
}
