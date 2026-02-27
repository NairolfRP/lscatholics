<template>
  <Head title="Travailler pour l'Archidiocèse" />

  <PageBanner py="16">
    <Typography variant="h1" class="md:text-5xl font-bold mb-4">Emploi</Typography>
    <p class="text-xl opacity-90">Travailler pour l'Archidiocèse de Los Santos</p>
  </PageBanner>

  <div class="container mx-auto max-w-7xl px-4 py-16">
    <div class="lg:hidden mb-6">
      <JobFiltersMobile :initial-filters="filters" />
    </div>

    <div class="mb-6">
      <JobActiveFilters :initial-filters="filters" />
    </div>

    <div class="flex gap-8">
      <aside class="hidden lg:block w-80 shrink-0">
        <JobFilters :initial-filters="filters" />
      </aside>

      <section class="flex-1 min-w-0">
        <div v-if="queryError" class="max-w-4xl mx-auto">
          <Alert variant="destructive">
            <CircleAlert class="h-4 w-4" />
            <AlertTitle>Échec du chargement</AlertTitle>
            <AlertDescription>
              Nous n'avons pas pu récupérer les offres d'emploi. Cela peut être dû à un problème
              serveur ou réseau. Réessayez plus tard.
            </AlertDescription>
          </Alert>
        </div>

        <div v-else-if="offers.data?.length" class="space-y-8">
          <div class="flex items-center justify-between">
            <p class="text-sm text-muted-foreground">
              <span class="font-semibold text-foreground">{{ offers.metadata.total }}</span>
              {{ offers.metadata.total > 1 ? 'offres trouvées' : 'offre trouvée' }}
            </p>
          </div>

          <div class="grid sm:grid-cols-2 gap-6">
            <ArticleCard
              v-for="job in offers.data"
              :key="job.id"
              route="jobs.single"
              :slug="job.slug"
              :category="getDepartmentTitleById(job.department)?.short || 'Département inconnu'"
              :title="job.title"
              :published-at="String(job.postedAt)"
            />
          </div>

          <ClientOnly>
            <WhenVisible v-if="hasMorePages" :params="whenVisibleParams" :always="hasMorePages">
              <div class="flex justify-center items-center py-8">
                <Loader2 class="w-6 h-6 animate-spin text-muted-foreground" />
                <span class="ml-2 text-sm text-muted-foreground">
                  Chargement d'autres offres...
                </span>
              </div>
            </WhenVisible>
          </ClientOnly>

          <div v-if="!hasMorePages && offers.metadata.total > 6" class="text-center py-8">
            <p class="text-sm text-muted-foreground">Vous avez vu toutes les offres disponibles</p>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Briefcase class="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Aucune offre d'emploi trouvée</h3>
          <p class="text-muted-foreground mb-6">
            {{
              hasActiveFilters
                ? 'Essayez de modifier vos filtres'
                : 'Revenez plus tard pour voir de nouvelles opportunités'
            }}
          </p>
          <Button v-if="hasActiveFilters" @click="clearAllFilters" variant="outline">
            <X class="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CircleAlert, Loader2, Briefcase, X } from 'lucide-vue-next'
import Head from '@/shared/components/AppHead.vue'
import { WhenVisible } from '@inertiajs/vue3'
import ClientOnly from '@/shared/components/ClientOnly.vue'
import ArticleCard from '@/shared/components/ArticleCard.vue'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Typography } from '@/shared/components/ui/typography'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Button } from '@/shared/components/ui/button'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { useJobFilters } from '@/features/jobs/composables/use_job_filters'
import JobActiveFilters from '@/features/jobs/components/JobActiveFilters.vue'
import JobFilters from '@/features/jobs/components/JobFilters.vue'
import JobFiltersMobile from '@/features/jobs/components/JobFiltersMobile.vue'
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

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

const props = defineProps<PageProps>()

const { hasActiveFilters, clearAllFilters } = useJobFilters(props.filters)

const hasMorePages = computed(() => {
  const { currentPage, lastPage } = props.offers.metadata
  return currentPage < lastPage
})

const whenVisibleParams = computed(() => ({
  only: ['offers', 'filters'],
  preserveUrl: true,
  data: {
    ...props.filters,
    page: props.offers.metadata.currentPage + 1,
  },
}))
</script>
