import Head from '@/shared/components/app-head'
import { WhenVisible } from '@inertiajs/react'
import { useMemo } from 'react'
import { Briefcase, CircleAlert, Loader2, X } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import HeroSection from '@/shared/components/layout/default/hero-section'
import PostCard from '@/shared/components/post-card'
import JobFilters from '@/features/jobs/components/job-filters'
import JobFiltersMobile from '@/features/jobs/components/job-filters-mobile'
import JobActiveFilters from '@/features/jobs/components/job-active-filters'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { useJobFilters } from '@/features/jobs/hooks/use_job_filters'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  offers: {
    data: Data.Careers.JobPosting.Variants['publicSummaryDetails'][]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: {
    search?: string
    departments?: string[]
    employmentTypes?: string[]
  }
  queryError?: boolean
}>

export default function JobsPage({ offers, filters: initialFilters, queryError }: PageProps) {
  const jobFilters = useJobFilters(initialFilters)

  const hasMorePages = offers.metadata.currentPage < offers.metadata.lastPage

  const whenVisibleParams = useMemo(
    () => ({
      only: ['offers', 'filters'],
      preserveUrl: true,
      data: {
        ...initialFilters,
        page: offers.metadata.currentPage + 1,
      },
    }),
    [initialFilters, offers.metadata.currentPage]
  )

  return (
    <>
      <Head title="Travailler pour l'Archidiocèse" />

      <HeroSection py="16">
        <Typography variant="h1" className="md:text-5xl font-bold mb-4">
          Emploi
        </Typography>
        <p className="text-xl opacity-90">Travailler pour l'Archidiocèse de Los Santos</p>
      </HeroSection>

      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="lg:hidden mb-6">
          <JobFiltersMobile jobFilters={jobFilters} />
        </div>

        <div className="mb-6">
          <JobActiveFilters jobFilters={jobFilters} />
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 shrink-0">
            <JobFilters jobFilters={jobFilters} />
          </aside>

          <section className="flex-1 min-w-0">
            {queryError && (
              <div className="max-w-4xl mx-auto">
                <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Échec du chargement</AlertTitle>
                  <AlertDescription>
                    Nous n'avons pas pu récupérer les offres d'emploi. Cela peut être dû à un
                    problème serveur ou réseau. Réessayez plus tard.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {!queryError && offers.data?.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{offers.metadata.total}</span>{' '}
                    {offers.metadata.total > 1 ? 'offres trouvées' : 'offre trouvée'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {offers.data.map((job) => (
                    <PostCard
                      key={job.id}
                      route="jobs.single"
                      routeParams={{ slug: job.slug }}
                      category={
                        getDepartmentTitleById(job.department)?.short || 'Département inconnu'
                      }
                      title={job.title}
                      publishedAt={String(job.postedAt)}
                    />
                  ))}
                </div>

                {hasMorePages && (
                  <WhenVisible fallback={<></>} params={whenVisibleParams} always={hasMorePages}>
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        Chargement d'autres offres...
                      </span>
                    </div>
                  </WhenVisible>
                )}

                {!hasMorePages && offers.metadata.total > 6 && (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Vous avez vu toutes les offres disponibles
                    </p>
                  </div>
                )}
              </div>
            )}

            {!queryError && !offers.data?.length && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Briefcase className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucune offre d'emploi trouvée</h3>
                <p className="text-muted-foreground mb-6">
                  {jobFilters.hasActiveFilters
                    ? 'Essayez de modifier vos filtres'
                    : 'Revenez plus tard pour voir de nouvelles opportunités'}
                </p>
                {jobFilters.hasActiveFilters && (
                  <Button onClick={jobFilters.clearAllFilters} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
