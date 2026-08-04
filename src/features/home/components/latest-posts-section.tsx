import { Fragment } from 'react/jsx-runtime'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { AlertCircleIcon, CalendarIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Badge } from '#/shared/components/ui/badge'
import { Button } from '#/shared/components/ui/button'
import { Separator } from '#/shared/components/ui/separator'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'
import { formatDate } from '#/utils/date'
import { latestPostsQueryOptions } from '#shared/queries/post.queries.ts'

export function LatestPostsSection() {
  const { data: posts, isPending, isError, refetch } = useQuery(latestPostsQueryOptions)

  if (isPending) return <LatestPostsSkeleton />
  if (isError) return <LatestPostsError onRetry={refetch} />
  if (posts.length === 0) return <Typography variant="p">Aucun article pour le moment</Typography>

  const latestPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Link
        to="/post/$slug"
        params={{ slug: latestPost.slug }}
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10 transition duration-300 group-hover:shadow-md">
          <Image
            src={latestPost.coverImageUrl}
            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            width={500}
            height={300}
            alt={latestPost.title}
            loading="lazy"
          />
        </div>
        {latestPost.category && (
          <Badge variant="secondary" className="mt-4 uppercase">
            {latestPost.category}
          </Badge>
        )}
        <Typography variant="h4" className="mt-2 transition-colors group-hover:text-catholic-gold">
          {latestPost.title}
        </Typography>
        <time className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarIcon className="size-3.5" />
          {formatDate(latestPost.publishedAt!.toISOString())}
        </time>
      </Link>

      <div className="flex flex-col gap-1">
        {otherPosts.map((post, index) => (
          <Fragment key={post.id}>
            <Link
              to="/post/$slug"
              params={{ slug: post.slug }}
              className="group block rounded-xl px-3 py-4 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {post.category && (
                <Badge variant="secondary" className="uppercase">
                  {post.category}
                </Badge>
              )}
              <Typography
                variant="h4"
                className="mt-2 transition-colors group-hover:text-catholic-gold"
              >
                {post.title}
              </Typography>
              <time className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarIcon className="size-3.5" />
                {formatDate(post.publishedAt!.toISOString())}
              </time>
            </Link>
            {index + 1 < otherPosts.length ? <Separator /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function LatestPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="aspect-16/10 w-full rounded-xl" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>

      <div className="flex flex-col gap-1">
        {Array.from({ length: 3 }).map((_item, index) => (
          <Fragment key={index}>
            <div className="space-y-3 rounded-xl px-3 py-4">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-24" />
            </div>
            {index >= 0 && index < 2 ? <Separator /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function LatestPostsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="md:col-span-2">
      <Alert variant="destructive" className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertCircleIcon />
          <AlertTitle>Échec du chargement</AlertTitle>
        </div>
        <AlertDescription>
          Le chargement des dernières actualités a échoué. Cela peut être dû à une erreur réseau ou
          à un problème interne.
        </AlertDescription>
        <Button variant="outline" onClick={onRetry}>
          Réessayer
        </Button>
      </Alert>
    </div>
  )
}
