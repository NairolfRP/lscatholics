import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DashboardJobPostingForm } from '#/features/job-posting/components/dashboard-job-posting-form.tsx'
import { genericDashboardJobPostingFormOptions } from '#/features/job-posting/forms/job-posting-form-options.ts'
import { createJobPostingSchema } from '#/features/job-posting/schemas/job-posting.schema.ts'
import { createJobPostingFn } from '#/server-fn/job-posting.functions.ts'
import { toast } from '#/shared/components/ui/toast'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/job-openings/create')({
  head: () => ({ meta: pageMetadata("Ajouter une offre d'emploi") }),
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'job', 'create')) {
      throw redirect({ to: '/dashboard/job-openings', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const form = useAppForm({
    defaultValues: genericDashboardJobPostingFormOptions.defaultValues,
    validators: {
      onChangeAsync: createJobPostingSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await createJobPostingFn({ data: value })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.error(result.error)
      }

      await queryClient.invalidateQueries({ queryKey: ['job-postings'] })

      void navigate({ to: '/dashboard/job-openings/show/$id', params: { id: result.jobPostingId } })
      toast.success("Offre d'emploi crée !")
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Ajouter une offre d'emploi"
          description="Publiez une nouvelle offre d'emploi sur l'application"
          backButton={{
            'to': '/dashboard/job-openings',
            'aria-label': "Retour sur la page d'administration des offres d'emplois",
            'preload': false,
          }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardJobPostingForm form={form as never} variant="create" />
        </div>
      </div>
    </div>
  )
}
