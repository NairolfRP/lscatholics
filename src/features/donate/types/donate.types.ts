import type { DonationOutput } from '#/features/donate/schemas/donate.schema.ts'

export type DonationMetadata = Omit<DonationOutput, 'fleecaConfirmation'>

export interface DonationNotificationData extends DonationMetadata {
  amount: number
}
