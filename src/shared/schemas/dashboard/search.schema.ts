import z from 'zod'
import { pageSchema, sortBySchema } from '#shared/schemas/pagination.schema.ts'

export const dashboardSearchSchema = z.object({
  search: z.string().catch('').default(''),
  page: pageSchema,
  sortBy: sortBySchema.catch('createdAt.desc').default('createdAt.desc'),
})

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>
