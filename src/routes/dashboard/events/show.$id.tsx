import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { EditIcon, EyeIcon } from 'lucide-react'
import { envClient } from '#/config/env-client.ts'
import { getDashboardChurchEventFn } from '#/features/church-event/server-fn/church-event.functions.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { hasPermission } from '#/shared/utils/permissions'
import { formatDateTime } from '#/utils/date.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { getParishInfo } from '#shared/constants/parish.ts'

export const Route = createFileRoute('/dashboard/events/show/$id')({
  beforeLoad: async ({ params, context }) => {
    if (!hasPermission(context.gameContext.permissions, 'event', 'read')) {
      throw redirect({ to: '/dashboard', replace: true })
    }

    const { author, ...churchEvent } = await getDashboardChurchEventFn({ data: params.id })

    const isAdmin = context.gameContext.user.role.includes('admin')
    const canEdit = hasPermission(context.gameContext.permissions, 'event', 'update')

    return { churchEvent, author: isAdmin ? author : null, isAdmin, canEdit }
  },
  loader: ({ context }) => ({
    churchEvent: context.churchEvent,
    author: context.author,
    isAdmin: context.isAdmin,
    canEdit: context.canEdit,
  }),
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return { meta: pageMetadata(loaderData.churchEvent.title) }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { churchEvent, author, isAdmin, canEdit } = Route.useLoaderData()

  const parish = churchEvent.parish ? getParishInfo(churchEvent.parish) : null

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title={churchEvent.title}
          description={
            <Typography className="text-muted-foreground">
              · {formatDateTime(churchEvent.startDate)}
              {churchEvent.endDate ? ` — ${formatDateTime(churchEvent.endDate)}` : null}
            </Typography>
          }
          backButton={{ to: '/dashboard/events', preload: false }}
          right={
            <div className="flex gap-2">
              <Link
                to="/event/$slug"
                params={{ slug: churchEvent.slug }}
                target="_blank"
                className={buttonVariants({ variant: 'outline' })}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Voir
              </Link>
              {canEdit ? (
                <Link
                  to="/dashboard/events/edit/$id"
                  params={{ id: churchEvent.id }}
                  className={buttonVariants()}
                >
                  <EditIcon className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              ) : null}
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Contenu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {churchEvent.coverImageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={churchEvent.coverImageUrl}
                      alt={churchEvent.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {churchEvent.flyerUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={churchEvent.flyerUrl}
                      alt="Flyer de l'événement"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {churchEvent.description && (
                  <div className="rounded-lg bg-muted p-4 ">
                    <p className="text-sm font-medium text-muted-foreground">
                      {churchEvent.description}
                    </p>
                  </div>
                )}

                <div className="prose max-w-none prose-gray dark:prose-invert">
                  <Markdown content={churchEvent.content} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">URL</p>
                  <code className="rounded px-2 py-1 text-xs text-muted-foreground">
                    {envClient.VITE_APP_URL + `/event/${churchEvent.slug}`}
                  </code>
                </div>

                {churchEvent.registrationRequired ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary"> Inscription requise </Badge>
                    <Badge variant="outline">
                      Max participants: {churchEvent.maxParticipants || 'Illimité'}
                    </Badge>
                  </div>
                ) : null}
                {parish ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Paroisse</p>
                    <p>{parish.title}</p>
                  </div>
                ) : null}
                <Separator />
                <div>
                  <p className="font-medium text-muted-foreground">Date de l'événement</p>
                  <p>{formatDateTime(churchEvent.startDate)}</p>
                </div>
                {churchEvent.endDate ? (
                  <div>
                    <p className="font-medium text-muted-foreground">Fin de l'événement</p>
                    <p>{formatDateTime(churchEvent.endDate)}</p>
                  </div>
                ) : null}
                <Separator />
                {isAdmin ? (
                  <div>
                    <p className="font-medium text-muted-foreground">[ADMIN] Ajouté par</p>
                    <p>
                      <em>{author?.name || 'Utilisateur inconnu/supprimé'}</em>
                    </p>
                  </div>
                ) : null}
                <div>
                  <p className="font-medium text-muted-foreground">Créé le</p>
                  <p>{formatDateTime(churchEvent.createdAt)}</p>
                </div>
                {churchEvent.updatedAt.toISOString() !== churchEvent.createdAt.toISOString() && (
                  <div>
                    <p className="font-medium text-muted-foreground">Modifié le</p>
                    <p>{formatDateTime(churchEvent.updatedAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
