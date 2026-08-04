import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardChurchEventForm } from '#/features/church-event/components/dashboard-church-event-form.tsx'
import type { EditChurchEventFormInput } from '#/features/church-event/schemas/church-event.schema.ts'
import { editChurchEventSchema } from '#/features/church-event/schemas/church-event.schema.ts'
import {
  getDashboardChurchEventFn,
  updateChurchEventFn,
} from '#/features/church-event/server-fn/church-event.functions.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { toast } from '#/shared/components/ui/toast'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/events/edit/$id')({
  beforeLoad: async ({ params, context }) => {
    if (!hasPermission(context.gameContext.permissions, 'event', 'update')) {
      throw redirect({ to: '/dashboard/events', replace: true })
    }

    const churchEvent = await getDashboardChurchEventFn({ data: params.id })
    return { churchEvent }
  },
  loader: ({ context }) => ({ churchEvent: context.churchEvent }),
  head: () => ({ meta: pageMetadata("Modifier l'événement") }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const { churchEvent } = Route.useLoaderData()

  const form = useAppForm({
    validators: {
      onChangeAsync: editChurchEventSchema,
    },
    defaultValues: {
      title: churchEvent.title,
      slug: churchEvent.slug,
      description: churchEvent.description,
      content: churchEvent.content,
      location: churchEvent.location,
      parish: churchEvent.parish,
      coverImageUrl: churchEvent.coverImageUrl,
      flyerUrl: churchEvent.flyerUrl,
      registrationRequired: churchEvent.registrationRequired,
      maxParticipants: churchEvent.maxParticipants,
      startDate: churchEvent.startDate,
      endDate: churchEvent.endDate,
    } as EditChurchEventFormInput,
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await updateChurchEventFn({
          data: { churchEventId: churchEvent.id, ...value },
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

        toast.success('Événement mis à jour !')
        void navigate({ to: '/dashboard/events/show/$id', params: { id: churchEvent.id } })
      } catch {
        toast.error('Une erreur est survenue.')
      }
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Modifier l'événement"
          description={churchEvent.title}
          backButton={{ to: '/dashboard/events', preload: false }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardChurchEventForm form={form as never} variant="edit" />
        </div>
      </div>
    </div>
  )
}
