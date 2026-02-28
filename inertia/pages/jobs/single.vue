<template>
  <Head :title="offer.title" :description="offer.summary || undefined" />

  <PageBanner py="16" bg-color="bg-muted" text-color="text-black">
    <div class="max-w-4xl">
      <Typography variant="h1" class="md:text-4xl font-serif font-semibold mb-3">
        {{ offer.title }}
      </Typography>
      <div class="flex flex-wrap items-center justify-center gap-4 text-base opacity-70">
        <span v-if="offer.department" class="flex items-center gap-2">
          <Building class="size-4" />
          {{ getDepartmentTitleById(offer.department)?.long || 'Non spécifié' }}
        </span>
        <span class="opacity-40">•</span>
        <time v-if="offer.postedAt" :datetime="offer.postedAt" class="flex items-center gap-2">
          <Calendar class="size-4" />
          Publié le {{ formatDate(offer.postedAt) }}
        </time>
      </div>
    </div>
  </PageBanner>

  <div class="container mx-auto max-w-screen-2xl px-4 py-12 space-y-10">
    <Button as-child>
      <Link route="jobs.index"><MoveLeft /> Consulter les autres offres d'emplois </Link>
    </Button>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
      <div class="col-span-1 lg:col-span-8">
        <Card class="p-6 md:p-8 xl:p-10">
          <CardContent class="space-y-10">
            <Typography>
              L'Archidiocèse de Los Santos est le plus grand diocèse catholique des États-Unis, avec
              plus de 5 millions de catholiques et 288 paroisses dans les comtés de Los Santos,
              Ventura et Santa Barbara. Il emploi plusieurs milliers de personnes pour servir ses
              communautés et son important réseau d'universités, d'écoles primaires et secondaires,
              ainsi que ses hôpitaux.
            </Typography>

            <div>
              <Typography variant="h2" class="font-semibold mb-4 pb-3 border-b-2 border-muted">
                Description du poste
              </Typography>
              <Typography
                v-if="offer.summary"
                class="whitespace-pre-line leading-relaxed text-base md:text-lg"
              >
                {{ offer.summary }}
              </Typography>
            </div>

            <div v-if="offer.responsibilities && offer.responsibilities.length > 0">
              <Typography variant="h3"> Fonctions essentielles </Typography>
              <Typography variant="list" class="space-y-3 ml-0">
                <li
                  v-for="(responsibility, index) in offer.responsibilities"
                  :key="`resp-${index}`"
                  class="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                >
                  <span class="text-primary shrink-0">
                    <CircleArrowRight class="size-5" />
                  </span>
                  <span>{{ responsibility }}</span>
                </li>
              </Typography>
            </div>

            <div v-if="offer.requirements && offer.requirements.length > 0">
              <Typography variant="h2" class="mb-4 pb-3 border-b-2 border-muted">
                Conditions requises
              </Typography>
              <Typography variant="list" class="space-y-3 ml-0">
                <li
                  v-for="(requirement, index) in offer.requirements"
                  :key="`req-${index}`"
                  class="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                >
                  <span class="text-primary shrink-0">
                    <BadgeCheck class="size-5" />
                  </span>
                  <span>{{ requirement }}</span>
                </li>
              </Typography>
            </div>

            <div v-if="offer.skills && offer.skills.length > 0">
              <Typography variant="h2" class="mb-4 pb-3 border-b-2 border-muted">
                Profil recherché
              </Typography>
              <Typography variant="list" class="space-y-3 ml-0">
                <li
                  v-for="(skill, index) in offer.skills"
                  :key="`skill-${index}`"
                  class="flex items-center gap-3 opacity-90 leading-relaxed font-medium"
                >
                  <span class="text-primary shrink-0">
                    <BadgeCheck class="size-5" />
                  </span>
                  <span>{{ skill }}</span>
                </li>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="col-span-1 lg:col-span-4">
        <div class="lg:sticky lg:top-6 space-y-6">
          <Card class="overflow-hidden pt-0">
            <CardHeader class="bg-primary text-primary-foreground px-6 py-4">
              <CardTitle class="font-semibold text-lg">Informations</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex justify-between items-start gap-4">
                <span class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Type
                </span>
                <span class="font-medium text-right">
                  {{ getEmploymentTypeLabel(offer.employmentType) }}
                </span>
              </div>

              <Separator />

              <div v-if="offer.salary" class="flex justify-between items-start gap-4">
                <span class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Relève de
                </span>
                <span class="font-medium text-right">
                  {{ offer.reportsTo }}
                </span>
              </div>

              <Separator />

              <div v-if="offer.salary" class="flex justify-between items-start gap-4">
                <span class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Salaire
                </span>
                <span class="font-medium text-right">
                  {{ formatSalary(offer.salary) }}
                </span>
              </div>

              <Separator />

              <div v-if="offer.expiresAt" class="flex justify-between items-start gap-4">
                <span class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Date limite
                </span>
                <span class="font-medium text-right">
                  {{ formatDate(offer.expiresAt) }}
                </span>
              </div>

              <Separator />

              <div class="flex justify-between items-start gap-4">
                <span class="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Statut
                </span>
                <Badge
                  :variant="offer.isActive ? 'success' : 'destructive'"
                  class="gap-1.5 px-2.5 py-1 rounded-full font-semibold"
                >
                  <template v-if="offer.isActive">
                    <BadgeCheckIcon />
                    Actif
                  </template>
                  <template v-else>
                    <CircleX />
                    Fermé
                  </template>
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card v-if="canApply" class="overflow-hidden">
            <CardHeader>
              <CardTitle class="text-lg">Postuler</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <Typography class="text-sm leading-relaxed">
                Envoyez votre CV au Département des Ressources Humaines.
              </Typography>

              <Button v-if="user" variant="default" class="w-full" as-child>
                <Link class="no-underline" route="jobs.application" :params="{ slug: offer.slug }">
                  Soumettre ma candidature
                </Link>
              </Button>
              <AuthentificationRequiredAlert v-else text="pour déposer une candidature." />

              <Separator />

              <div>
                <p class="text-muted-foreground mb-1 font-medium">Téléphone</p>
                <span class="opacity-90 flex items-center gap-2">
                  <Phone class="size-4" />
                  700
                </span>
              </div>
            </CardContent>
          </Card>

          <Card class="bg-muted rounded-lg border text-muted-foreground p-5 shadow-none">
            <CardContent class="text-xs text-muted-foreground leading-relaxed p-0">
              L'Archidiocèse de Los Santos garanti l'égalité des chances dans l'emploi. Cependant,
              en tant qu'organisation religieuse à but non lucratif, il peut favoriser les candidats
              catholiques pratiquants sur certains postes.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Head from '@/shared/components/AppHead.vue'
import { Typography } from '@/shared/components/ui/typography'
import { formatDate } from '@/lib/utils'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import {
  BadgeCheck,
  CircleArrowRight,
  BadgeCheckIcon,
  CircleX,
  Phone,
  Building,
  Calendar,
  MoveLeft,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { Badge } from '@/shared/components/ui/badge'
import { Link } from '@adonisjs/inertia/vue'
import AuthentificationRequiredAlert from '@/shared/components/AuthentificationRequiredAlert.vue'
import { useUser } from '@/shared/composables/use_user'
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  offer: Data.Careers.JobPosting.Variants['allFields']
}>

const user = useUser()

const props = defineProps<PageProps>()

const getEmploymentTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    full_time: 'Temps plein',
    part_time: 'Temps partiel',
    contract: 'Contrat',
    internship: 'Stage',
    temporary: 'Temporaire',
    permanent: 'Permanent',
  }
  return types[type] || type
}

const formatSalary = (salary: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary)

  return formatted.replace(/,/g, ' ').replace('$', '') + '$/semaine'
}

const canApply = props.offer.isActive
</script>
