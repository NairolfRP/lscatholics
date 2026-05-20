import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import {
  BadgeCheck,
  BadgeCheck as BadgeCheckIcon,
  Building,
  Calendar,
  CircleArrowRight,
  CircleX,
  MoveLeft,
  Phone,
} from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import LoginAlert from '@/shared/components/auth/login-alert'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { useUser } from '@/shared/hooks/use_user'
import { formatDate } from '@/lib/utils'
import { urlFor } from '@/lib/client'
import type { Data } from '@generated/data'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Container } from '@/shared/components/ui/container'

type PageProps = {
  offer: Data.Careers.JobPosting.Variants['allFields']
}

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  full_time: 'Temps plein',
  part_time: 'Temps partiel',
  contract: 'Contrat',
  internship: 'Stage',
  temporary: 'Temporaire',
  permanent: 'Permanent',
}

function formatSalary(salary: number): string {
  return (
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
      .format(salary)
      .replace(/,/g, ' ')
      .replace(/\$/g, '') + '$/semaine'
  )
}

export default function JobSinglePage({ offer }: PageProps) {
  const user = useUser()
  const canApply = offer.isActive

  return (
    <>
      <Head title={offer.title} />

      <HeroSection py="16" bgColor="bg-muted" textColor="text-black">
        <div className="max-w-4xl">
          <Typography variant="h1" className="md:text-4xl font-semibold mb-3">
            {offer.title}
          </Typography>
          <div className="flex flex-wrap items-center justify-center gap-4 text-base opacity-70">
            {offer.department && (
              <span className="flex items-center gap-2">
                <Building className="size-4" />
                {getDepartmentTitleById(offer.department)?.long || 'Non spécifié'}
              </span>
            )}
            <span className="opacity-40">•</span>
            {offer.postedAt && (
              <time dateTime={offer.postedAt} className="flex items-center gap-2">
                <Calendar className="size-4" />
                Publié le {formatDate(offer.postedAt)}
              </time>
            )}
          </div>
        </div>
      </HeroSection>

      <Container spacing="md" className="px-4 space-y-10">
        <Button asChild>
          <Link href={urlFor('jobs.index')}>
            <MoveLeft /> Consulter les autres offres d'emplois
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          <div className="col-span-1 lg:col-span-8">
            <Card className="sm:p-6 md:p-8 xl:p-10">
              <CardContent className="space-y-10">
                <Typography>
                  L'Archidiocèse de Los Santos est le plus grand diocèse catholique des États-Unis,
                  avec plus de 5 millions de catholiques et 288 paroisses dans les comtés de Los
                  Santos, Ventura et Santa Barbara. Il emploi plusieurs milliers de personnes pour
                  servir ses communautés et son important réseau d'universités, d'écoles primaires
                  et secondaires, ainsi que ses hôpitaux.
                </Typography>

                <div>
                  <Typography
                    variant="h2"
                    className="font-semibold mb-4 pb-3 border-b-2 border-muted"
                  >
                    Description du poste
                  </Typography>
                  {offer.summary && (
                    <Typography className="whitespace-pre-line leading-relaxed text-base md:text-lg">
                      {offer.summary}
                    </Typography>
                  )}
                </div>

                {offer.responsibilities && offer.responsibilities.length > 0 && (
                  <div>
                    <Typography variant="h3">Fonctions essentielles</Typography>
                    <Typography variant="list" className="space-y-3 ml-0">
                      {offer.responsibilities.map((responsibility, index) => (
                        <li
                          key={`resp-${index}`}
                          className="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                        >
                          <span className="text-primary shrink-0">
                            <CircleArrowRight className="size-5" />
                          </span>
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </Typography>
                  </div>
                )}

                {offer.requirements && offer.requirements.length > 0 && (
                  <div>
                    <Typography variant="h2" className="mb-4 pb-3 border-b-2 border-muted">
                      Conditions requises
                    </Typography>
                    <Typography variant="list" className="space-y-3 ml-0">
                      {offer.requirements.map((requirement, index) => (
                        <li
                          key={`req-${index}`}
                          className="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                        >
                          <span className="text-primary shrink-0">
                            <BadgeCheck className="size-5" />
                          </span>
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </Typography>
                  </div>
                )}

                {offer.skills && offer.skills.length > 0 && (
                  <div>
                    <Typography variant="h2" className="mb-4 pb-3 border-b-2 border-muted">
                      Profil recherché
                    </Typography>
                    <Typography variant="list" className="space-y-3 ml-0">
                      {offer.skills.map((skill, index) => (
                        <li
                          key={`skill-${index}`}
                          className="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                        >
                          <span className="text-primary shrink-0">
                            <BadgeCheck className="size-5" />
                          </span>
                          <span>{skill}</span>
                        </li>
                      ))}
                    </Typography>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <div className="lg:sticky lg:top-6 space-y-6">
              <Card className="overflow-hidden pt-0">
                <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
                  <CardTitle className="font-semibold text-lg">Informations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Type
                    </span>
                    <span className="font-medium text-right">
                      {EMPLOYMENT_TYPE_LABELS[offer.employmentType] || offer.employmentType}
                    </span>
                  </div>

                  <Separator />

                  {offer.reportsTo && (
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Relève de
                        </span>
                        <span className="font-medium text-right">{offer.reportsTo}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {offer.salary && (
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Salaire
                        </span>
                        <span className="font-medium text-right">{formatSalary(offer.salary)}</span>
                      </div>
                      <Separator />
                    </>
                  )}

                  {offer.expiresAt && (
                    <>
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          Date limite
                        </span>
                        <span className="font-medium text-right">
                          {formatDate(offer.expiresAt)}
                        </span>
                      </div>
                      <Separator />
                    </>
                  )}

                  <div className="flex justify-between items-start gap-4">
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Statut
                    </span>
                    <Badge
                      variant={offer.isActive ? 'success' : 'destructive'}
                      className="gap-1.5 px-2.5 py-1 rounded-full font-semibold"
                    >
                      {offer.isActive ? (
                        <>
                          <BadgeCheckIcon className="size-3" /> Actif
                        </>
                      ) : (
                        <>
                          <CircleX className="size-3" /> Fermé
                        </>
                      )}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {canApply && (
                <Card className="overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg">Postuler</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Typography className="text-sm leading-relaxed">
                      Envoyez votre CV au Département des Ressources Humaines.
                    </Typography>

                    {user ? (
                      <Button variant="default" className="w-full" asChild>
                        <Link
                          className="no-underline"
                          href={urlFor('jobs.application', { slug: offer.slug })}
                        >
                          Soumettre ma candidature
                        </Link>
                      </Button>
                    ) : (
                      <LoginAlert text="pour déposer une candidature." />
                    )}

                    <Separator />

                    <div>
                      <p className="text-muted-foreground mb-1 font-medium">Téléphone</p>
                      <span className="opacity-90 flex items-center gap-2">
                        <Phone className="size-4" />
                        700
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-muted rounded-lg border text-muted-foreground p-5 shadow-none">
                <CardContent className="text-xs text-muted-foreground leading-relaxed p-0">
                  L'Archidiocèse de Los Santos garanti l'égalité des chances dans l'emploi.
                  Cependant, en tant qu'organisation religieuse à but non lucratif, il peut
                  favoriser les candidats catholiques pratiquants sur certains postes.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
