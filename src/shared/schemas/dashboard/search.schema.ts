import z from 'zod'
import { pageSchema, sortBySchema } from '#shared/schemas/pagination.schema.ts'

export const dashboardSearchSchema = z.object({
  search: z.string().catch('').default(''),
  page: pageSchema,
  sortBy: sortBySchema.catch('createdAt.desc').default('createdAt.desc'),
})

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>

export const dashboardFiltersSchema = z.object({
  search: z.string().default(''),
  page: z.int().positive().default(1),
  sortBy: z.string().default('createdAt.desc'),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
