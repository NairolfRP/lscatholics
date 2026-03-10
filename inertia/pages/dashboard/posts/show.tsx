import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, Edit, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { client } from '@/client'
import { MarkdownContent } from '@/shared/components/ui/markdown'

type PageProps = InertiaProps<{
  post: Data.Posts.Post.Variants['allFields']
}>

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardShowPostPage({ post }: PageProps) {
  return (
    <>
      <Head title={post.title} />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link route="dashboard.dashboard_posts.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Par {post.author?.name || 'un auteur inconnu'} ·
                {post.createdAt ? formatDate(post.createdAt) : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link route="news.single" routeParams={{ slug: post.slug }} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Voir
              </Link>
            </Button>
            <Button asChild>
              <Link route="dashboard.dashboard_posts.edit" routeParams={{ id: post.id }}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Link>
            </Button>
          </div>
        </div>

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
                  <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {post.excerpt}
                    </p>
                  </div>
                )}

                <div className="prose prose-gray max-w-none dark:prose-invert">
                  <MarkdownContent content={post.content} />
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
                  <p className="font-medium text-gray-500 dark:text-gray-400">URL</p>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                    {import.meta.env.VITE_APP_URL +
                      client.urlFor('news.single', { slug: post.slug })}
                  </code>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Auteur</p>
                  <p>{post.author?.name || 'Inconnu'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Créé le</p>
                  <p>{post.createdAt ? formatDate(post.createdAt) : 'Date inconnue'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-500 dark:text-gray-400">Modifié le</p>
                  <p>{post.updatedAt ? formatDate(post.updatedAt) : 'Jamais'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
