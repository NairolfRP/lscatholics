import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useLoaderData, useParams } from '@tanstack/react-router'
import { isBefore } from 'date-fns'
import { AlertCircleIcon, ArrowLeftIcon, ClockIcon, Send } from 'lucide-react'
import { JobPostingDetailSections } from '#/features/job-posting/components/job-posting-detail-sections.tsx'
import { JobPostingSummaryContent } from '#/features/job-posting/components/job-posting-summary-content.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { formatDate } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert'
import { Badge } from '#shared/components/ui/badge'
import { buttonVariants } from '#shared/components/ui/button'
import { Card, CardFooter } from '#shared/components/ui/card'
import { Separator } from '#shared/components/ui/separator'
import { employmentTypeLabel } from '#shared/constants/employment.ts'
import { cn } from '#shared/lib/utils.ts'

export default function JobPostingSinglePage() {
  const { slug } = useParams({ from: '/_app/job/$slug/' })
  const { data: job } = useSuspenseQuery(singleJobPostingQueryOptions(slug))
  const { now: nowISO } = useLoaderData({ from: '/_app/job/$slug/' })
  const isExpired = Boolean(job.expiresAt && isBefore(new Date(job.expiresAt), new Date(nowISO)))
  const department = getDepartmentTitle(job.department)

  return (
    <article className="container mx-auto max-w-5xl space-y-12 px-4 pt-[calc(var(--header-height)+46px)] pb-20 sm:px-6 lg:px-8">
      <Link to="/careers" className={buttonVariants()}>
        <ArrowLeftIcon /> Retour vers la liste des offres d'emploi
      </Link>

      {isExpired && <ExpiredJobAlert />}

      <div className="mb-10 space-y-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="default">{department ?? 'Département : N/A'}</Badge>
          <Badge variant="outline">{employmentTypeLabel[job.employmentType]}</Badge>
          {job.postedAt && (
            <Badge
              variant="outline"
              className="border-transparent bg-transparent text-muted-foreground"
            >
              <ClockIcon className="mr-1.5 h-3 w-3" />
              Publié le {formatDate(job.postedAt)}
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{job.title}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-10 lg:col-span-2">
          <JobPostingDetailSections job={job} />
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[calc(var(--header-height)+25px)] border-neutral-200 pt-0 shadow-sm">
            <JobPostingSummaryContent job={job} />
            <Separator />
            <CardFooter className="pt-6">
              <Link
                from="/job/$slug/"
                to="/job/$slug/apply"
                className={cn(buttonVariants({ size: 'lg' }), 'h-12 w-full text-base')}
                disabled={isExpired}
              >
                {isExpired ? 'Candidatures fermées' : 'Postuler maintenant'}
                {!isExpired && <Send className="ml-2 h-4 w-4" />}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </article>
  )
}

function ExpiredJobAlert() {
  return (
    <Alert variant="destructive" className="mb-8">
      <AlertCircleIcon className="h-4 w-4" />
      <AlertTitle>Offre expirée</AlertTitle>
      <AlertDescription>
        Cette offre d'emploi n'accepte plus de nouvelles candidatures actuellement.
      </AlertDescription>
    </Alert>
  )
}
