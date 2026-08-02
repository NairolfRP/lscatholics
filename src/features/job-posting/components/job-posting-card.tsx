import { Link } from '@tanstack/react-router'
import { ArrowRight, BriefcaseIcon, Building2Icon, CalendarDaysIcon, ClockIcon } from 'lucide-react'
import type { JobPosting } from '#/features/job-posting/types/job-posting.types.ts'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import { employmentTypeLabel } from '#shared/constants/employment.ts'

export function JobPostingCard({ job }: { job: JobPosting }) {
  const department = getDepartmentTitle(job.department) ?? 'Département : N/A'

  return (
    <Link to="/job/$slug" params={{ slug: job.slug }}>
      <Card className="group cursor-pointer overflow-hidden transition-all hover:border hover:border-primary hover:shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="flex-1 space-y-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge>
                  <BriefcaseIcon />
                  {employmentTypeLabel[job.employmentType]}
                </Badge>
                {job.postedAt && (
                  <span className="flex items-center text-xs font-medium text-muted-foreground">
                    <ClockIcon className="mr-1 h-3 w-3" />
                    {formatDate(job.postedAt)}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold transition-colors group-hover:text-primary">
                {job.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                {job.expiresAt && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                    Date limite :{' '}
                    {formatDateTime(job.expiresAt, {
                      day: '2-digit',
                      month: 'short',
                      year: undefined,
                    })}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Building2Icon className="h-4 w-4 text-muted-foreground" />
                  {department}
                </div>
              </div>
            </div>

            <div className="mt-4 flex shrink-0 items-center justify-between md:mt-0 md:flex-col md:items-end">
              {job.salaryMin && (
                <div className="mb-4 rounded-full bg-success/30 px-3 py-1 text-sm font-semibold">
                  À partir de ${(job.salaryMin / 1000).toFixed(0)}k
                </div>
              )}
              <Button variant="ghost" className="group-hover:bg-primary/30">
                Voir l'offre
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
