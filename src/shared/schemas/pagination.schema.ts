import z from 'zod'

export const pageSchema = z.coerce.number().int().min(1).max(500).positive().catch(1).default(1)

export const sortBySchema = z.string().optional() as z.ZodOptional<
  z.ZodType<`${string}.asc` | `${string}.desc`>
>
