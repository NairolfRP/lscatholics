import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { isPast } from 'date-fns'
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react'
import {
  EmploymentApplicationForm,
} from '#/features/job-application/components/employment-application-form.tsx'
import {
  EmploymentApplicationSidebar,
} from '#/features/job-application/components/employment-application-sidebar.tsx'
import { singleJobPostingQueryOptions } from '#/features/job-posting/queries.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardDescription, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
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
              <Card className="bg-muted py-5">
                <CardHeader>
                  <CardTitle />
                  <CardDescription className="leading-relaxed">
                    L’Archidiocèse recrute, embauche et promeut son personnel sur la base du mérite,
                    des compétences et des qualifications, sans discrimination fondée sur la race,
                    la couleur de peau, l’origine nationale ou ethnique, l’ascendance, un handicap
                    physique ou mental, l’état de santé, la situation matrimoniale, le sexe, l’âge,
                    la grossesse ou le statut d’ancien combattant.
                    <br />
                    <br />
                    L’Archidiocèse se réserve le droit d’être le seul juge du mérite, des
                    compétences et des qualifications, et peut accorder une préférence aux candidats
                    catholiques dans l’ensemble de ses décisions en matière d’emploi, en fonction de
                    considérations religieuses et d’autres besoins, critères et politiques
                    religieux.
                  </CardDescription>
                </CardHeader>
              </Card>
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
