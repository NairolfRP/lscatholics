import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import { EmploymentApplicationDisclaimer } from '#/features/job-application/components/employment-application-disclaimer.tsx'
import { SpontaneousApplicationForm } from '#/features/job-application/components/spontaneous-application-form.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function SpontaneousApplicationPage() {
  return (
    <>
      <Hero
        variant="minimal"
        size="sm"
        backgroundColor="bg-linear-to-r from-blue-900 to-blue-700"
        title={<Typography variant="h1">Candidature spontanée</Typography>}
        subtitle="Aucune offre actuelle ne vous correspond ? Remplissez le formulaire ci-dessous et indiquez-nous le poste que vous souhaitez proposer."
      />

      <section className="container mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex justify-start pt-10">
          <Link to="/careers" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
            <ArrowLeftIcon /> Retour aux offres d'emploi
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          <EmploymentApplicationDisclaimer />
          <SpontaneousApplicationForm />
        </div>
      </section>
    </>
  )
}
