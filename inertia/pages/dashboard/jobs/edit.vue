<template>
  <Head title="Modifier l'offre d'emploi" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_jobs.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Modifier l'offre d'emploi</h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ job.title }}
        </p>
      </div>
    </div>

    <JobDashboardForm id="edit-job-form" :form="form" variant="edit" @submit="onSubmit" />
  </div>
</template>
<script lang="ts" setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { hasRoute, urlFor } from '@/client'
import JobDashboardForm from '@/features/jobs/components/form/dashboard/JobDashboardForm.vue'
import { useDashboardEditJobForm } from '@/features/jobs/composables/dashboard/use_dashboard_job_form'
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  job: Data.Careers.JobPosting.Variants['allFields']
}>

const props = defineProps<PageProps>()

const form = useDashboardEditJobForm(props.job)

const onSubmit = (values: Record<string, any>) => {
  if (!hasRoute('dashboard.dashboard_jobs.update')) return
  router.put(
    urlFor('dashboard.dashboard_jobs.update', {
      id: props.job.id,
    }),
    values,
    {
      onError: (res: Record<string, any>) => {
        form.setErrors(res)
      },
    }
  )
}
</script>
