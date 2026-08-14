import { formOptions } from '@tanstack/react-form'
import type { BankTransferInput } from '#/features/banking/schema/banking.schema.ts'

export const transferFormOptions = formOptions({
  defaultValues: {
    iban: '',
    amount: '',
    description: '',
    comment: '',
  } as unknown as BankTransferInput,
})
