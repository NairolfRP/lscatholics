import { InertiaProps } from '@/types'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { JobDashboardForm } from '@/features/jobs/components/form/dashboard/job-dashboard-form'
import { useAppForm } from '@/shared/hooks/form'
import { hasRoute, urlFor } from '@/client'
import { router } from '@inertiajs/react'
import { serverErrorsFormConvertor } from '@/lib/utils'

type PageProps = InertiaProps<{}>

export default function DashboardCreateJobPostingPage({}: PageProps) {
  const form = useAppForm({
    ...createJobFormOpts,
    onSubmit: ({ value }) => {
      if (!hasRoute('dashboard.dashboard_jobs.store')) return
      router.post(urlFor('dashboard.dashboard_jobs.store'), value, {
        onError: (err) => {
          form.setErrorMap({
            onSubmit: serverErrorsFormConvertor(err),
          })
        },
      })
    },
  })

  return (
    <>
      <Head title="Créer une offre d'emploi" />
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link route="dashboard.dashboard_jobs.index">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Créer une offre d'emploi</h1>
            <p className="text-gray-500 dark:text-gray-400">Ajoutez une nouvelle offre d'emploi</p>
          </div>
        </div>

        <form
          id="create-job-offer-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <JobDashboardForm form={form} />
        </form>
      </div>
    </>
  )
}
