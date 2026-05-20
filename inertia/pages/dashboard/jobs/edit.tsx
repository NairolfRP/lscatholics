import { InertiaProps } from '@/shared/types/pages'
import { editJobFormOpts } from '@/features/jobs/constants/form_opts'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { JobDashboardForm } from '@/features/jobs/components/form/dashboard/job-dashboard-form'
import { useAppForm } from '@/lib/form'
import { client, urlFor } from '@/lib/client'
import { router } from '@inertiajs/react'
import type { Data } from '@generated/data'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { withDashboardLayout } from '@/shared/components/layout'

type PageProps = InertiaProps<{
  job: Data.Careers.JobPosting.Variants['allFields']
}>

export default withDashboardLayout<PageProps>(
  ({ job }) => {
    const form = useAppForm({
      ...editJobFormOpts(job),
      onSubmit: ({ value }) => {
        if (!client.has('dashboard.dashboard_jobs.update')) return
        router.put(
          urlFor('dashboard.dashboard_jobs.update', {
            id: job.id,
          }),
          value,
          {
            onError: (err) => {
              form.setErrorMap({
                onSubmit: serverErrorsFormConvertor(err),
              })
            },
          }
        )
      },
    })

    return (
      <>
        <Head title="Modifier l'offre d'emploi" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link route="dashboard.dashboard_jobs.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier l'offre d'emploi</h1>
              <p className="text-gray-500 dark:text-gray-400">{job.title}</p>
            </div>
          </div>

          <form
            id="edit-job-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <JobDashboardForm id="edit-job-form" form={form} variant="edit" />
          </form>
        </div>
      </>
    )
  },
  {
    breadcrumb: (props) => [
      { label: "Offres d'emplois", href: urlFor('dashboard.dashboard_jobs.index') },
      { label: `Modifier « ${props.job.title}` },
    ],
  }
)
