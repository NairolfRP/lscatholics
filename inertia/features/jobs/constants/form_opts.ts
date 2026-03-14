import { formOptions } from '@tanstack/react-form'
import { type JobOfferData, jobOfferSchema } from '@/features/jobs/schemas/create_job_offer.schema'
import type { Data } from '@generated/data'

export const createJobFormOpts = formOptions({
  validators: {
    onChange: jobOfferSchema,
  },
  defaultValues: {
    responsibilities: ['', ''],
    requirements: ['', ''],
    skills: ['', ''],
    isActive: true,
    postedAt: new Date(Date.now()),
  } as JobOfferData,
})

export const editJobFormOpts = (
  job: Omit<Data.Careers.JobPosting.Variants['allFields'], 'createdAt' | 'updatedAt'>
) => {
  return formOptions({
    validators: {
      onChange: jobOfferSchema,
    },
    defaultValues: {
      title: job?.title || '',
      slug: job?.slug || '',
      summary: job?.summary || '',
      reportsTo: job?.reportsTo || '',
      department: job?.department,
      responsibilities: job?.responsibilities || [],
      requirements: job?.requirements || [],
      skills: job?.skills || [],
      salary: job?.salary || undefined,
      employmentType: job?.employmentType,
      isActive: !!job?.isActive,
      postedAt: job?.postedAt ? new Date(job?.postedAt) : undefined,
      expiresAt: job?.expiresAt ? new Date(job?.expiresAt) : undefined,
    } as JobOfferData,
  })
}
