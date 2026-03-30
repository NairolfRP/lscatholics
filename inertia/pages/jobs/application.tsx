import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import { useAppForm } from '@/shared/hooks/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import { urlFor } from '@/client'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import Head from '@/shared/components/app-head'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Field } from '@/shared/components/ui/field'
import { EmploymentApplicationPersonalInfoFields } from '@/features/employment-application/components/form/fields/employment-application-personal-info-fields'
import { EmploymentApplicationProfessionalExperienceFields } from '@/features/employment-application/components/form/fields/employment-application-professional-experience-fields'
import { EmploymentApplicationEducationFields } from '@/features/employment-application/components/form/fields/employment-application-education-fields'
import { EmploymentApplicantDeclarationFields } from '@/features/employment-application/components/form/fields/employment-application-declaration-fields'
import { EmploymentApplicationOOCFields } from '@/features/employment-application/components/form/fields/employment-application-ooc-fields'
import { Container } from '@/shared/components/ui/container'
import { ActionButton } from '@/shared/components/action-button'

type PageProps = InertiaProps<{
  job: Data.Careers.JobPosting.Variants['employmentApplication']
}>

const sectionTitleClasses = 'border-b mb-3'
const sectionClasses = 'mb-5'

export default function EmploymentApplicationPage({ job, user }: PageProps) {
  const form = useAppForm({
    ...employmentApplicationFormOpts(
      user!.currentCharacter?.firstname,
      user!.currentCharacter?.lastname
    ),
    onSubmit: ({ value }) => {
      router.post(urlFor('jobs.application_submit', { slug: job.slug }), value, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success('Succès', {
            description:
              "Votre demande d'emploi a été enregistrée avec succès. Vous recevrez très bientôt une réponse du Département des Ressources Humaines.",
          })
          form.reset()
        },
        onError: (err) => {
          form.setErrorMap({
            onSubmit: serverErrorsFormConvertor(err),
          })
        },
      })
    },
  })

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <>
      <Head title="Demande d'emploi" />

      <HeroSection py="16" bgColor="bg-linear-to-r from-primary to-catholic-blue/60">
        <div className="max-w-4xl">
          <Typography variant="h1" className="text-inherit md:text-4xl font-semibold mb-3">
            Demande d'emploi
          </Typography>
          <Typography variant="h2" className="text-inherit">
            {job.title}
          </Typography>
        </div>
      </HeroSection>

      <Container size="content" spacing="md" className="container mx-auto px-4 space-y-10">
        <Card className="w-full rounded-none">
          <CardHeader className="border-b space-y-3">
            <CardTitle className="text-2xl scroll-m-20 tracking-tight">
              Demande d'emploi : {job.title}
            </CardTitle>
            <CardDescription>
              L’Archidiocèse recrute, embauche et promeut son personnel sur la base du mérite, des
              compétences et des qualifications, sans discrimination fondée sur la race, la couleur
              de peau, l’origine nationale ou ethnique, l’ascendance, un handicap physique ou
              mental, l’état de santé, la situation matrimoniale, le sexe, l’âge, la grossesse ou le
              statut d’ancien combattant.
              <br />
              <br />
              L’Archidiocèse se réserve le droit d’être le seul juge du mérite, des compétences et
              des qualifications, et peut accorder une préférence aux candidats catholiques dans
              l’ensemble de ses décisions en matière d’emploi, en fonction de considérations
              religieuses et d’autres besoins, critères et politiques religieux.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id={`employment-application-${job.slug}`}
              onSubmit={onSubmit}
              className="flex flex-col gap-4"
            >
              <div className={sectionClasses}>
                <Typography variant="h4" className={sectionTitleClasses}>
                  Informations personnelles
                </Typography>
                <EmploymentApplicationPersonalInfoFields form={form} />
              </div>

              <div className={sectionClasses}>
                <Typography variant="h4" className={sectionTitleClasses}>
                  Éducation et compétences
                </Typography>
                <EmploymentApplicationEducationFields form={form} />
              </div>

              <div className={sectionClasses}>
                <Typography variant="h4" className={sectionTitleClasses}>
                  Expérience professionnelle
                </Typography>
                <EmploymentApplicationProfessionalExperienceFields form={form} />
              </div>

              <div className={sectionClasses}>
                <form.Subscribe selector={(state) => state.values.gender}>
                  {(gender) => (
                    <Typography variant="h4" className={sectionTitleClasses}>
                      Déclaration {gender === 'female' ? 'de la candidate' : 'du candidat'}
                    </Typography>
                  )}
                </form.Subscribe>
                <EmploymentApplicantDeclarationFields form={form} />
              </div>

              <div className={sectionClasses}>
                <Typography variant="h4" className={sectionTitleClasses}>
                  (( Section OOC ))
                </Typography>
                <EmploymentApplicationOOCFields form={form} />
              </div>
            </form>
          </CardContent>

          <CardFooter className="border-t">
            <Field orientation="horizontal">
              <ActionButton
                type="button"
                variant="outline"
                areYouSureTitle="Êtes-vous sûr de vouloir réinitialiser le formulaire ?"
                action={handleReset}
                requireAreYouSure
              >
                Réinitialiser
              </ActionButton>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.isValidating]}
              >
                {([canSubmit, isSubmitting, isValidating]) => (
                  <Button
                    type="submit"
                    form={`employment-application-${job.slug}`}
                    disabled={!canSubmit || isSubmitting || isValidating}
                  >
                    Soumettre la candidature
                  </Button>
                )}
              </form.Subscribe>
            </Field>
          </CardFooter>
        </Card>
      </Container>
    </>
  )
}
