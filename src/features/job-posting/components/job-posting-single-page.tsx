import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { isPast } from 'date-fns'
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  BanknoteIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  CircleArrowRightIcon,
  ClockIcon,
  Send,
  UserCircleIcon,
} from 'lucide-react'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert'
import { Badge } from '#shared/components/ui/badge'
import { buttonVariants } from '#shared/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '#shared/components/ui/card'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Separator } from '#shared/components/ui/separator'
import { employmentTypeLabel } from '#shared/constants/employment.ts'
import { cn } from '#shared/lib/utils.ts'

const formatSalary = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(',', ' ')
}

export default function JobPostingSinglePage() {
  const { slug } = useParams({ from: '/_app/job/$slug/' })
  const { data: job } = useSuspenseQuery(singleJobPostingQueryOptions(slug))

  const isExpired = Boolean(job.expiresAt && isPast(new Date(job.expiresAt)))

  const department = getDepartmentTitle(job.department)

  return (
    <article className="container mx-auto max-w-5xl space-y-12 px-4 pt-[calc(var(--header-height)+46px)] pb-20 sm:px-6 lg:px-8">
      <Link to="/careers" className={buttonVariants()}>
        <ArrowLeftIcon /> Retour vers la liste des offres d'emploi
      </Link>

      {isExpired && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Offre expirée</AlertTitle>
          <AlertDescription>
            Cette offre d'emploi n'accepte plus de nouvelles candidatures actuellement.
          </AlertDescription>
        </Alert>
      )}

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
          {job.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">À propos du poste</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-neutral prose-headings:font-semibold prose-p:leading-relaxed">
                <Markdown content={job.description} />
              </CardContent>
            </Card>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-semibold">Vos missions</h2>
              <ul className="space-y-4">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CircleArrowRightIcon className="mt-0.5 h-6 w-6 shrink-0 font-bold text-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-semibold">Conditions requises</h2>
              <ul className="space-y-4">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 h-6 w-6 shrink-0 font-bold text-primary" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-semibold">Profil recherché</h2>
              <ul className="space-y-4">
                {job.skills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 h-6 w-6 shrink-0 font-bold text-primary" />
                    <span className="leading-relaxed">{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-[calc(var(--header-height)+25px)] border-neutral-200 pt-0 shadow-sm">
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

              {job.expiresAt && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2 text-muted-foreground">
                    <CalendarDaysIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Fin des candidatures
                    </p>
                    <p className="font-medium">{formatDateTime(job.expiresAt)}</p>
                  </div>
                </div>
              )}
            </CardContent>

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
