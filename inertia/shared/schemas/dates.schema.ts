import { z } from 'zod'

export const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'Format requis: YYYY-MM')
  .refine(
    (date) => {
      const [year, month] = date.split('-').map(Number)
      return year >= 1950 && year <= new Date().getFullYear() + 1 && month >= 1 && month <= 12
    },
    { error: 'Date invalide' }
  )
