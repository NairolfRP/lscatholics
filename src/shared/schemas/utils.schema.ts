import { z } from 'zod'

export const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .union([z.literal(''), z.undefined(), z.null(), schema])
    .transform((val) => (val === '' || val == null ? null : val))
