import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import {
  DashboardJobPostingForm,
} from '#/features/job-posting/components/dashboard-job-posting-form.tsx'
import type { EditJobPostingFormInput } from '#/features/job-posting/schemas/job-posting.schema.ts'
import { editJobPostingSchema } from '#/features/job-posting/schemas/job-posting.schema.ts'
import { getDashboardJobPostingFn, updateJobPostingFn } from '#/server-fn/job-posting.functions.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/job-openings/edit/$id')({
  beforeLoad: async ({ params }) => {
    const jobPosting = await getDashboardJobPostingFn({ data: params.id })
    return { jobPosting }
  },
  loader: ({ context }) => ({ jobPosting: context.jobPosting }),
  head: () => ({ meta: pageMetadata("Modifier l'offre d'emploi") }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { jobPosting } = Route.useLoaderData()

  const form = useAppForm({
    validators: {
      onChangeAsync: editJobPostingSchema,
    },
    defaultValues: {
      title: jobPosting.title,
      slug: jobPosting.slug,
      description: jobPosting.description,
      reportsTo: jobPosting.reportsTo,
      department: jobPosting.department,
      responsibilities: jobPosting.responsibilities,
      requirements: jobPosting.requirements,
      skills: jobPosting.skills,
      salary: {
        min: jobPosting.salaryMin,
        max: jobPosting.salaryMax,
      },
      employmentType: jobPosting.employmentType,
      isActive: jobPosting.isActive,
      postedAt: jobPosting.postedAt,
      expiresAt: jobPosting.expiresAt,
    } as EditJobPostingFormInput,
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await updateJobPostingFn({
          data: { jobPostingId: jobPosting.id, ...value },
        })

        if (!result.success) {
          if (result.validationErrors) {
            return formApi.setErrorMap({
              onServer: {
                fields: result.validationErrors,
              },
            } as unknown as Parameters<typeof formApi.setErrorMap>[0])
          }

          return toast.error('Une erreur est survenue')
        }

        toast.success("Offre d'emploi mise à jour !")
        void navigate({ to: '/dashboard/job-openings/show/$id', params: { id: jobPosting.id } })
      } catch {
        toast.error('Une erreur est survenue.')
      }
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Modifier l'offre d'emploi"
          description={jobPosting.title}
          backButton={{
            'to': '/dashboard/job-openings',
            'aria-label': "Retour sur la page d'administration des offres d'emplois",
            'preload': false,
          }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardJobPostingForm form={form as never} variant="edit" />
        </div>
      </div>
    </div>
  )
}
