import type { z } from 'zod'
import type { parishionerSchema } from '@/features/register-parishioner/schemas/parishioner.schema'

export type RegisterParishionerFormValues = z.Infer<typeof parishionerSchema>
