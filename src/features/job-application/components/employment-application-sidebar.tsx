import { JobPostingSummaryContent } from '#/features/job-posting/components/job-posting-summary-content.tsx'
import type { JobPostingSummaryJob } from '#/features/job-posting/components/job-posting-summary-content.tsx'
import { Card } from '#shared/components/ui/card.tsx'

export type EmploymentApplicationSidebarJob = JobPostingSummaryJob & {
  title: string
}

export function EmploymentApplicationSidebar({ job }: { job: EmploymentApplicationSidebarJob }) {
  return (
    <Card className="border-neutral-200 pt-0 shadow-sm">
      <JobPostingSummaryContent job={job} showPostedAt />
    </Card>
  )
}
