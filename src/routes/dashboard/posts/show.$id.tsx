import { createFileRoute, isNotFound, Link, notFound, redirect } from '@tanstack/react-router'
import { EditIcon, EyeIcon } from 'lucide-react'
import { envClient } from '#/config/env-client.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { getDashboardPostFn } from '#/server-fn/post.functions.ts'
import { formatDateTime } from '#/utils/date.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { parseCsvString } from '#/utils/string.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { Markdown } from '#shared/components/ui/markdown.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'

export const Route = createFileRoute('/dashboard/posts/show/$id')({
  beforeLoad: async ({ params, context }) => {
    try {
      const { author, ...post } = await getDashboardPostFn({ data: params.id })
      const isAdmin = parseCsvString(context.gameContext.user.role).includes('admin')

      return { post, author: isAdmin ? author : null, isAdmin }
    } catch (err) {
      if (isNotFound(err)) {
        throw notFound()
      }

      if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
        throw redirect({ to: '/dashboard/posts', replace: true })
      }

      toast.add({
        type: 'error',
        description: 'Une erreur est survenue',
        priority: 'high',
      })
      throw redirect({ to: '/dashboard/posts' })
    }
  },
  loader: ({ context }) => ({
    post: context.post,
    author: context.author,
    isAdmin: context.isAdmin,
  }),
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return { meta: pageMetadata(loaderData.post.title) }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { post, author, isAdmin } = Route.useLoaderData()
  return (
    <>
      <DashboardHeading
        title={post.title}
        description={
          <Typography className="text-muted-foreground">
            Par {post.authorDisplayName || 'un auteur inconnu'}{' '}
            {isAdmin ? <em>({author?.name || 'Utilisateur inconnu/supprimé'})</em> : undefined} ·
            {formatDateTime(post.createdAt)}
          </Typography>
        }
        backButton={{ to: '/dashboard/posts', preload: false }}
        right={
          <div className="flex gap-2">
            <Link
              to="/post/$slug"
              params={{ slug: post.slug }}
              target="_blank"
              className={buttonVariants({ variant: 'outline' })}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Voir
            </Link>
            <Link
              to="/dashboard/posts/edit/$id"
              params={{ id: post.id }}
              className={buttonVariants()}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contenu</CardTitle>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.coverImageUrl && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {post.excerpt && (
                <div className="rounded-lg bg-muted p-4 ">
                  <p className="text-sm font-medium text-muted-foreground">{post.excerpt}</p>
                </div>
              )}

              <div className="prose max-w-none prose-gray dark:prose-invert">
                <Markdown content={post.content} />
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
                  {envClient.VITE_APP_URL + `/post/${post.slug}`}
                </code>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Date de publication</p>
                <p>{post.publishedAt ? formatDateTime(post.publishedAt) : <em>Pas définie</em>}</p>
              </div>
              <Separator />
              <div>
                <p className="font-medium text-muted-foreground">Auteur</p>
                <p>
                  {post.authorDisplayName || <em>Inconnu</em>}{' '}
                  {isAdmin ? (
                    <em>({author?.name || 'Utilisateur inconnu/supprimé'})</em>
                  ) : undefined}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Créé le</p>
                <p>{formatDateTime(post.createdAt)}</p>
              </div>
              {post.updatedAt.toISOString() !== post.createdAt.toISOString() && (
                <div>
                  <p className="font-medium text-muted-foreground">Modifié le</p>
                  <p>{formatDateTime(post.updatedAt)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
