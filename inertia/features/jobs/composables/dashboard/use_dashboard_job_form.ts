import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createJobOfferSchema } from '@/features/jobs/schemas/dashboard/create_job_offer.schema'
import type { Data } from '@generated/data'

export const useDashboardCreateJobForm = () => {
  return useForm({
    validationSchema: toTypedSchema(createJobOfferSchema),
    initialValues: {
      responsibilities: ['', ''],
      requirements: ['', ''],
      isActive: true,
      postedAt: new Date(Date.now()),
    },
  })
}

export function useDashboardEditJobForm(
  job: Omit<Data.Careers.JobPosting.Variants['allFields'], 'createdAt' | 'updatedAt'>
) {
  return useForm({
    validationSchema: toTypedSchema(createJobOfferSchema),
    initialValues: {
      title: job?.title || '',
      slug: job?.slug || '',
      summary: job?.summary || undefined,
      reportsTo: job?.reportsTo || undefined,
      department: job?.department || '',
      responsibilities: job?.responsibilities || [],
      requirements: job?.requirements || [],
      salary: job?.salary || undefined,
      employmentType: job?.employmentType || '',
      isActive: !!job?.isActive,
      postedAt: (job?.postedAt ? new Date(job?.postedAt) : undefined) as Date | undefined,
      expiresAt: (job?.expiresAt ? new Date(job?.expiresAt) : undefined) as Date | undefined,
    },
  })
}
