import { formOptions } from '@tanstack/react-form'
import type {
  CreateJobPostingFormInput,
} from '#/features/job-posting/schemas/job-posting.schema.ts'

export const genericDashboardJobPostingFormOptions = formOptions({
  defaultValues: {
    title: '',
    slug: '',
    description: '',
    reportsTo: '',
    department: null,
    responsibilities: [],
    requirements: [],
    skills: [],
    salary: {
      min: null,
      max: null,
    },
    employmentType: null,
    isActive: true,
    postedAt: new Date(),
    expiresAt: null,
  } as unknown as CreateJobPostingFormInput,
})
