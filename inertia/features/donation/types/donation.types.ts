import { z } from 'zod'
import { donateSchema } from '@/features/donation/schemas/donate.schema'

export type DonationFormValues = z.Infer<typeof donateSchema>
