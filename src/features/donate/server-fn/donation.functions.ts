import { createServerFn } from '@tanstack/react-start'
import * as donationPaymentService from '#/features/donate/server/donation-payment.service'
import { looseObjectSchema } from '#shared/schemas/common.schema.ts'

export const initiateDonationFn = createServerFn({ method: 'POST' })
  .validator(looseObjectSchema)
  .handler(({ data }) => donationPaymentService.initiateDonation(data))
