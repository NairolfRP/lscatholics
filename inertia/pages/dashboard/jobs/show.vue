<template>
  <Head :title="job.title" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" as-child>
          <Link :href="urlFor('dashboard.dashboard_jobs.index')">
            <ArrowLeft class="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ job.title }}</h1>
          <p class="text-gray-500 dark:text-gray-400">
            {{ job.postedAt ? formatDate(job.postedAt) : '' }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <Link :href="urlFor('jobs.single', { slug: job.slug })" target="_blank">
            <Eye class="mr-2 h-4 w-4" />
            Voir
          </Link>
        </Button>
        <Button as-child>
          <Link :href="urlFor('dashboard.dashboard_jobs.edit', { id: job.id })">
            <Edit class="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Contenu</CardTitle>
              <Badge :variant="job.isActive ? 'default' : 'destructive'">
                {{ job.isActive ? 'Actif' : 'Fermée' }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800 space-y-6">
              <div v-if="job.summary">
                <Typography variant="h2">Description</Typography>
                <Typography class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ job.summary }}
                </Typography>
              </div>

              <div v-if="!!job.responsibilities.length">
                <Typography variant="h3">Fonctions essentielles</Typography>
                <Typography v-for="responsability in job.responsibilities" variant="list">
                  <li>{{ responsability }}</li>
                </Typography>
              </div>
            </div>

            <div
              v-if="!!job.requirements.length"
              class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
            >
              <Typography variant="h2">Conditions requises</Typography>
              <Typography v-for="requirement in job.requirements" variant="list">
                <li>{{ requirement }}</li>
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div v-if="job.employmentType">
              <p class="font-medium text-gray-500 dark:text-gray-400">Type d'emploi</p>
              <p>{{ getEmploymentTypeLabel(job.employmentType) }}</p>
            </div>
            <div v-if="job.salary">
              <p class="font-medium text-gray-500 dark:text-gray-400">Salaire</p>
              <p>{{ formatSalary(job.salary) }}</p>
            </div>
            <div v-if="job.reportsTo">
              <p class="font-medium text-gray-500 dark:text-gray-400">Relève de</p>
              <p>{{ job.reportsTo }}</p>
            </div>
            <div v-if="job.department">
              <p class="font-medium text-gray-500 dark:text-gray-400">Département</p>
              <p>{{ getDepartmentTitleById(job.department)?.long || 'Inconnu' }}</p>
            </div>
            <div v-if="job.expiresAt">
              <p class="font-medium text-gray-500 dark:text-gray-400">Date limite de candidature</p>
              <p>{{ formatDate(job.expiresAt) }}</p>
            </div>
            <div v-if="job.postedAt">
              <p class="font-medium text-gray-500 dark:text-gray-400">Publiée le</p>
              <p>{{ formatDate(job.postedAt) }}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations techniques</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">URL</p>
              <code class="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                {{ urlFor('jobs.single', { slug: job.slug }) }}
              </code>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Créée le</p>
              <p>{{ job.createdAt ? formatDate(job.createdAt) : 'Date inconnue' }}</p>
            </div>
            <div v-if="job.updatedAt">
              <p class="font-medium text-gray-500 dark:text-gray-400">Modifiée le</p>
              <p>{{ formatDate(job.updatedAt) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { ArrowLeft, Edit, Eye } from 'lucide-vue-next'
import { urlFor } from '@/client'
import { Typography } from '@/shared/components/ui/typography'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  job: Data.Careers.JobPosting.Variants['allFields']
}>

defineProps<PageProps>()

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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatSalary = (salary: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(salary)

  return formatted.replace(/,/g, ' ').replace('$', '') + '$/semaine'
}
</script>
