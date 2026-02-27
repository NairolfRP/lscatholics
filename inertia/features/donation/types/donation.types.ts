import type { z } from 'zod'
import type { donateSchema } from '@/features/donation/schemas/donate.schema'

export type DonationFormValues = z.Infer<typeof donateSchema>
