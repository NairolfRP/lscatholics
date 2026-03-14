import type { Infer as VineInfer } from '@vinejs/vine/types'
import type { donateSchema } from '#donate/validators/donate'

export type DonateMetadata = VineInfer<typeof donateSchema>

export type DonationNotificationData = Omit<DonateMetadata, 'fleecaConfirmation'>
