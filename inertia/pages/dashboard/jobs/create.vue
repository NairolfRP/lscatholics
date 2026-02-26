<template>
  <Head title="Créer une offre d'emploi" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_jobs.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Créer une offre d'emploi</h1>
        <p class="text-gray-500 dark:text-gray-400">Ajoutez une nouvelle offre d'emploi</p>
      </div>
    </div>

    <JobDashboardForm :form="form" @submit="onSubmit" />
  </div>
</template>
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { hasRoute, urlFor } from '@/client'
import { useDashboardCreateJobForm } from '@/features/jobs/composables/dashboard/use_dashboard_job_form'
import JobDashboardForm from '@/features/jobs/components/form/dashboard/JobDashboardForm.vue'

const form = useDashboardCreateJobForm()

const onSubmit = (values: Record<string, any>) => {
  if (!hasRoute('dashboard.dashboard_jobs.store')) return

  router.post(urlFor('dashboard.dashboard_jobs.store'), values)
}
</script>
