import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { isPast } from 'date-fns'
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react'
import { EmploymentApplicationDisclaimer } from '#/features/job-application/components/employment-application-disclaimer.tsx'
import { EmploymentApplicationForm } from '#/features/job-application/components/employment-application-form.tsx'
import { EmploymentApplicationSidebar } from '#/features/job-application/components/employment-application-sidebar.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function EmploymentApplicationPage() {
  const { slug } = useParams({ from: '/_app/job/$slug/apply' })
  const { data: job } = useSuspenseQuery(singleJobPostingQueryOptions(slug))

  const isExpired = Boolean(job.expiresAt && isPast(new Date(job.expiresAt)))

  return (
    <>
      <Hero
        variant="minimal"
        size="sm"
        backgroundColor="bg-linear-to-r from-blue-900 to-blue-700"
        title={<Typography variant="h1">Postuler — {job.title}</Typography>}
        subtitle="Rejoignez l'équipe de l'Archidiocèse de Los Santos. Remplissez le formulaire de candidature ci-dessous : seuls les champs marqués d'un astérisque sont obligatoires."
      />

      <section className="container mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="-mt-10 flex justify-start">
          <Link
            to="/job/$slug"
            params={{ slug }}
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            <ArrowLeftIcon /> Retour à l'offre d'emploi
          </Link>
        </div>

        {isExpired ? (
          <Alert variant="destructive" className="mt-10">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Offre expirée</AlertTitle>
            <AlertDescription>
              Cette offre d'emploi n'accepte plus de nouvelles candidatures actuellement.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="mt-10 grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
            <div className="flex flex-col gap-5 lg:col-span-3">
              <EmploymentApplicationDisclaimer />
              <EmploymentApplicationForm />
            </div>
            <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:col-span-2">
              <EmploymentApplicationSidebar job={job} />
            </div>
          </div>
        )}
      </section>
    </>
  )
}
