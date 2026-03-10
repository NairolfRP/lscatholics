import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, Edit, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Typography } from '@/shared/components/ui/typography'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { client } from '@/client'

type PageProps = InertiaProps<{
  job: Data.Careers.JobPosting.Variants['allFields']
}>

const getEmploymentTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    full_time: 'Temps plein',
    part_time: 'Temps partiel',
    contract: 'Contrat',
    internship: 'Stage',
    temporary: 'Temporaire',
    permanent: 'Permanent',
  }
  return types[type] || type
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatSalary = (salary: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary)

  return formatted.replace(/,/g, ' ').replace('$', '') + '$/semaine'
}

export default function DashboardShowJobPostingPage({ job }: PageProps) {
  return (
    <>
      <Head title={job.title} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link route="dashboard.dashboard_jobs.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {job.postedAt ? formatDate(job.postedAt) : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link route="jobs.single" routeParams={{ slug: job.slug }} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </Button>
            <Button asChild>
              <Link route="dashboard.dashboard_jobs.edit" routeParams={{ id: job.id }}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Contenu</CardTitle>
                  <Badge variant={job.isActive ? 'default' : 'destructive'}>
                    {job.isActive ? 'Actif' : 'Fermée'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800 space-y-6">
                  <div>
                    <Typography variant="h2">Description</Typography>
                    {job.summary && (
                      <Typography className="whitespace-pre-line text-sm font-medium text-gray-700 dark:text-gray-300">
                        {job.summary}
                      </Typography>
                    )}
                  </div>

                  {!!job.responsibilities?.length && (
                    <div>
                      <Typography variant="h3">Fonctions essentielles</Typography>
                      {job.responsibilities.map((responsability) => (
                        <Typography variant="list">
                          <li>{responsability}</li>
                        </Typography>
                      ))}
                    </div>
                  )}
                </div>

                {!!job.requirements?.length && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <Typography variant="h2">Conditions requises</Typography>
                    {job.requirements.map((requirement) => (
                      <Typography variant="list">
                        <li>{requirement}</li>
                      </Typography>
                    ))}
                  </div>
                )}

                {!!job.skills?.length && (
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <Typography variant="h2">Profil recherché</Typography>
                    {job.skills.map((skill) => (
                      <Typography variant="list">
                        <li>{skill}</li>
                      </Typography>
                    ))}
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
                {job.employmentType && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Type d'emploi</p>
                    <p>{getEmploymentTypeLabel(job.employmentType)}</p>
                  </div>
                )}
                {job.salary && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Salaire</p>
                    <p>{formatSalary(job.salary)}</p>
                  </div>
                )}
                {job.reportsTo && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Relève de</p>
                    <p>{job.reportsTo}</p>
                  </div>
                )}
                {job.department && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Département</p>
                    <p>{getDepartmentTitleById(job.department)?.long || 'Inconnu'}</p>
                  </div>
                )}
                {job.expiresAt && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">
                      Date limite de candidature
                    </p>
                    <p>{formatDate(job.expiresAt)}</p>
                  </div>
                )}
                {job.postedAt && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Publiée le</p>
                    <p>{formatDate(job.postedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">URL</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                    {import.meta.env.VITE_APP_URL +
                      client.urlFor('jobs.single', { slug: job.slug })}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Créée le</p>
                  <p>{job.createdAt ? formatDate(job.createdAt) : 'Date inconnue'}</p>
                </div>
                {job.updatedAt && (
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Modifiée le</p>
                    <p>{formatDate(job.updatedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
