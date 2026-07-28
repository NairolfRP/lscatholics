import { createFileRoute, Link } from '@tanstack/react-router'
import { EditIcon, EyeIcon } from 'lucide-react'
import { envClient } from '#/config/env-client.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { getDashboardJobPostingFn } from '#/server-fn/job-posting.functions.ts'
import { formatDateTime } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { employmentTypeLabel } from '#shared/constants/employment.ts'
import { formatJobPostingSalary } from '#/features/job-posting/utils/job-posting.utils.ts'

export const Route = createFileRoute('/dashboard/job-openings/show/$id')({
  beforeLoad: async ({ params, context }) => {
    const { author, ...jobPosting } = await getDashboardJobPostingFn({ data: params.id })
    const isAdmin = context.gameContext.user.role.includes('admin')

    return { jobPosting, author: isAdmin ? author : null, isAdmin }
  },
  loader: ({ context }) => ({
    jobPosting: context.jobPosting,
    author: context.author,
    isAdmin: context.isAdmin,
  }),
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return { meta: pageMetadata(loaderData.jobPosting.title) }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { jobPosting, author, isAdmin } = Route.useLoaderData()

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title={jobPosting.title}
          description={
            <Typography className="text-muted-foreground">
              {jobPosting.postedAt ? formatDateTime(jobPosting.postedAt) : null}
            </Typography>
          }
          backButton={{ to: '/dashboard/job-openings', preload: false }}
          right={
            <div className="flex gap-2">
              <Link
                to="/job/$slug"
                params={{ slug: jobPosting.slug }}
                target="_blank"
                className={buttonVariants({ variant: 'outline' })}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Voir
              </Link>
              <Link
                to="/dashboard/job-openings/edit/$id"
                params={{ id: jobPosting.id }}
                className={buttonVariants()}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobPosting.description ? (
                  <div className="rounded-lg bg-muted p-4">
                    <div className="prose max-w-none prose-gray dark:prose-invert">
                      <Markdown content={jobPosting.description} />
                    </div>
                  </div>
                ) : null}

                {!!jobPosting.responsibilities?.length && (
                  <div className="rounded-lg bg-muted p-4">
                    <Typography variant="h2">Fonctions essentielles</Typography>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                      {jobPosting.responsibilities.map((responsibility, index) => (
                        <li key={index}>{responsibility}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!!jobPosting.requirements?.length && (
                  <div className="rounded-lg bg-muted p-4">
                    <Typography variant="h2">Conditions requises</Typography>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                      {jobPosting.requirements.map((requirement, index) => (
                        <li key={index}>{requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!!jobPosting.skills?.length && (
                  <div className="rounded-lg bg-muted p-4">
                    <Typography variant="h2">Profil recherché</Typography>
                    <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                      {jobPosting.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-muted-foreground">État</p>
                  {jobPosting.isActive ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Fermée</Badge>
                  )}
                </div>

                <div>
                  <p className="font-medium text-muted-foreground">Type d'emploi</p>
                  <p>{employmentTypeLabel[jobPosting.employmentType]}</p>
                </div>

                {jobPosting.salaryMin ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Salaire</p>
                    <p>
                      {formatJobPostingSalary({
                        min: jobPosting.salaryMin,
                        max: jobPosting.salaryMax,
                      })}
                    </p>
                  </div>
                ) : null}

                {jobPosting.reportsTo ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Relève de</p>
                    <p>{jobPosting.reportsTo}</p>
                  </div>
                ) : null}

                <div>
                  <p className="font-medium text-muted-foreground">Département</p>
                  <p>
                    {getDepartmentTitle(jobPosting.department, true) ?? (
                      <em>Département inconnu ou supprimé</em>
                    )}
                  </p>
                </div>

                {jobPosting.expiresAt ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Date limite de candidature</p>
                    <p>{formatDateTime(jobPosting.expiresAt)}</p>
                  </div>
                ) : null}

                {jobPosting.postedAt ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Publiée / Rouverte le</p>
                    <p>{formatDateTime(jobPosting.postedAt)}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">URL</p>
                  <code className="rounded px-2 py-1 text-xs text-muted-foreground">
                    {envClient.VITE_APP_URL + `/job/${jobPosting.slug}`}
                  </code>
                </div>
                <Separator />
                {isAdmin ? (
                  <div>
                    <p className="font-medium text-muted-foreground">[ADMIN] Ajoutée par</p>
                    <p>
                      <em>{author?.name || 'Utilisateur inconnu/supprimé'}</em>
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="font-medium text-muted-foreground">Créée le</p>
                  <p>{formatDateTime(jobPosting.createdAt)}</p>
                </div>
                {jobPosting.updatedAt.toISOString() !== jobPosting.createdAt.toISOString() && (
                  <div>
                    <p className="font-medium text-muted-foreground">Modifiée le</p>
                    <p>{formatDateTime(jobPosting.updatedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
