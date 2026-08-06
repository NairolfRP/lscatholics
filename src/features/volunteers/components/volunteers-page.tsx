import { HandHeartIcon } from 'lucide-react'
import { VolunteerApplicationForm } from '#/features/volunteers/components/volunteer-application-form.tsx'
import { VolunteerBenefits } from '#/features/volunteers/components/volunteer-benefits.tsx'
import { VolunteersSidebar } from '#/features/volunteers/components/volunteer-sidebar.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function VolunteersPage() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r dark:from-blue-800 dark:to-blue-900 from-blue-400 to-blue-600"
        title={<Typography variant="h1">Devenez bénévole</Typography>}
        subtitle="Rejoignez les Charités catholiques de l'Archidiocèse de Los Santos. Les possibilités d'aider son prochain sont infinies. Vivez une expérience humaine riche et changez des vies."
      >
        <a
          href="#volunteer-application-form"
          className={buttonVariants({ variant: 'secondary', size: 'lg' })}
        >
          <HandHeartIcon /> Proposer mon aide
        </a>
      </Hero>

      <section className="container mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Nos programmes ont besoin de bénévoles au service des personnes les plus vulnérables des
            comtés de Los Santos, Ventura et Santa Barbara. Vous pouvez participer à des actions
            concrètes comme des distributions alimentaires, des groupes de soutien, des animations
            pour les personnes en difficulté et plus encore. Nous pouvons vous affirmer que votre
            action, quoi qu'il arrive, changera des vies.
          </p>
        </div>
        <div className="mt-8 pb-12">
          <VolunteerBenefits />
        </div>
      </section>

      <section
        id="volunteer-application-form"
        className="container mx-auto max-w-7xl scroll-mt-32 px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <VolunteerApplicationForm />
          </div>
          <div className="flex flex-col gap-5 lg:top-28 lg:col-span-2">
            <VolunteersSidebar />
          </div>
        </div>
      </section>
    </>
  )
}
