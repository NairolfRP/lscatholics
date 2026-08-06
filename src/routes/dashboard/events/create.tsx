import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  DashboardChurchEventForm,
} from '#/features/church-event/components/dashboard-church-event-form.tsx'
import type {
  CreateChurchEventFormInput,
} from '#/features/church-event/schemas/church-event.schema.ts'
import { createChurchEventSchema } from '#/features/church-event/schemas/church-event.schema.ts'
import { createChurchEventFn } from '#/features/church-event/server-fn/church-event.functions.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { toast } from '#/shared/components/ui/toast'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/events/create')({
  head: () => ({ meta: pageMetadata('Créer un événement') }),
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'event', 'create')) {
      throw redirect({ to: '/dashboard/events', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const form = useAppForm({
    validators: {
      onChangeAsync: createChurchEventSchema,
    },
    defaultValues: {
      parish: null,
      flyerUrl: null,
      registrationRequired: false,
      maxParticipants: null,
      endDate: null,
    } as CreateChurchEventFormInput,
    onSubmit: async ({ value, formApi }) => {
      const result = await createChurchEventFn({ data: value })

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

      await queryClient.invalidateQueries({ queryKey: ['events'] })

      if (result.churchEventId) {
        void navigate({ to: '/dashboard/events/show/$id', params: { id: result.churchEventId } })
      } else {
        void navigate({ to: '/dashboard/events' })
      }

      toast.success('Événement créé !')
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Créer un événement"
          description="Publier un nouvel événement de l'archidiocèse sur l'application"
          backButton={{
            'to': '/dashboard/events',
            'aria-label': "Retour sur la page d'administration des événements",
            'preload': false,
          }}
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardChurchEventForm form={form as never} variant="create" />
        </div>
      </div>
    </div>
  )
}
