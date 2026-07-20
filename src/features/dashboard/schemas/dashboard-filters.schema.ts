import { z } from 'zod'

export const dashboardFiltersSchema = z.object({
  search: z.string().default(''),
  page: z.number().int().positive().default(1),
  sortBy: z.string().default('createdAt.desc'),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
