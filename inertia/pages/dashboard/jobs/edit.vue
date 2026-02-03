<template>
  <Head title="Modifier l'offre d'emploi" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="tuyau.$url('dashboard.dashboard_jobs.index')">
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
import { tuyau } from '@/lib/tuyau'
import Job from '#pages/models/job'
import JobDashboardForm from '@/features/jobs/components/form/dashboard/JobDashboardForm.vue'
import { useDashboardEditJobForm } from '@/features/jobs/composables/dashboard/use_dashboard_job_form'

type Props = {
  job: Job & { postedAt: string; expiresAt: string }
}

const props = defineProps<Props>()

const form = useDashboardEditJobForm(props.job)

const onSubmit = (values: Record<string, any>) => {
  if (!tuyau.$has('dashboard.dashboard_jobs.update')) return
  router.put(
    tuyau.$url('dashboard.dashboard_jobs.update', {
      params: {
        id: props.job.id,
      },
    }),
    values
  )
}
</script>
