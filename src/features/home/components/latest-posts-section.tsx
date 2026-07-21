import { Fragment } from 'react/jsx-runtime'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { AlertCircleIcon } from 'lucide-react'
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
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Link to="/post/$slug" params={{ slug: latestPost.slug }} className="hover:text-primary">
        <div className="space-y-3 ">
          <Image
            src={latestPost.coverImageUrl}
            className="aspect-video w-full object-cover shadow-xs md:aspect-2/2"
            width={500}
            height={300}
            alt={latestPost.title}
            loading="lazy"
          />
          {latestPost.category && <Badge className="uppercase">{latestPost.category}</Badge>}
          <Typography variant="h4">{latestPost.title}</Typography>
        </div>

        <time className=" text-sm text-muted-foreground">
          {formatDate(latestPost.publishedAt!.toISOString())}
        </time>
      </Link>

      <Separator className="block md:hidden data-horizontal:h-1" />

      <div className="flex flex-col gap-5">
        {otherPosts.map((post, index) => (
          <Fragment key={post.id}>
            <div className="space-y-3">
              <Link
                to="/post/$slug"
                params={{ slug: post.slug }}
                className="contents hover:text-primary"
              >
                {post.category && <Badge className="uppercase">{post.category}</Badge>}
                <Typography variant="h4">{post.title}</Typography>
                <time className="text-sm text-muted-foreground">
                  {formatDate(post.publishedAt!.toISOString())}
                </time>
              </Link>
            </div>
            {index + 1 < otherPosts.length ? <Separator /> : null}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

function LatestPostsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="space-y-4">
        <Skeleton className="aspect-16/10 w-full rounded-lg" />
        <Skeleton className="h-5 w-10 rounded-full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-3 w-20" />
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_item, index) => (
          <Fragment key={index}>
            <div className="space-y-3">
              <Skeleton className="h-5 w-10 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-18" />
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
    <div className="col-span-2">
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
