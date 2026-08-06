import {
  BanknoteIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarDaysIcon,
  ClockIcon,
  UserCircleIcon,
} from 'lucide-react'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { employmentTypeLabel } from '#shared/constants/employment.ts'
import type { DepartmentId } from '#shared/types/department.types.ts'
import type { EmploymentType } from '#shared/types/employment.types.ts'

export type EmploymentApplicationSidebarJob = {
  title: string
  department: DepartmentId
  employmentType: EmploymentType
  salaryMin: number | null
  salaryMax: number | null
  reportsTo: string | null
  expiresAt: Date | null
  postedAt: Date | null
}

export function EmploymentApplicationSidebar({ job }: { job: EmploymentApplicationSidebarJob }) {
  const department = getDepartmentTitle(job.department)

  return (
    <Card className="border-neutral-200 pt-0 shadow-sm">
      <CardHeader className="rounded-t-xl bg-muted py-5">
        <CardTitle className="text-lg font-semibold">Résumé de l'offre</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2 text-muted-foreground">
            <BriefcaseIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Type d'emploi</p>
            <p className="font-medium">{employmentTypeLabel[job.employmentType]}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2 text-muted-foreground">
            <Building2Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Département</p>
            <p className="font-medium capitalize">{department}</p>
          </div>
        </div>

        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2 text-muted-foreground">
              <BanknoteIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rémunération</p>
              <p className="font-medium">
                {job.salaryMin && job.salaryMax
                  ? `${formatSalary(job.salaryMin)} - ${formatSalary(job.salaryMax)}`
                  : job.salaryMin
                    ? formatSalary(job.salaryMin)
                    : null}
              </p>
            </div>
          </div>
        )}

        {job.reportsTo && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2 text-muted-foreground">
              <UserCircleIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Relève de</p>
              <p className="font-medium">{job.reportsTo}</p>
            </div>
          </div>
        )}

        {job.postedAt && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2 text-muted-foreground">
              <ClockIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Publié le</p>
              <p className="font-medium">{formatDate(job.postedAt)}</p>
            </div>
          </div>
        )}

        {job.expiresAt && (
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-2 text-muted-foreground">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fin des candidatures</p>
              <p className="font-medium">{formatDateTime(job.expiresAt)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(',', ' ')
}
