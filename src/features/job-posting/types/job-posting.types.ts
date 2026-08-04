import type { InferSelectModel } from 'drizzle-orm'
import type { jobPostings } from '#server/db/schema'
import type { ActionButtonReturnType } from '#shared/components/action-button.tsx'

export type DashboardJobPostingsTableMeta = {
  canUpdate: boolean
  canDelete: boolean
  onDelete: (jobPostingId: string) => ActionButtonReturnType
  onToggleActiveState: (jobPostingId: string) => ActionButtonReturnType
}

export type JobPosting = InferSelectModel<typeof jobPostings>
