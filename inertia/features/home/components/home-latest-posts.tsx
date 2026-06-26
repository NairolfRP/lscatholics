import { Skeleton } from '@/shared/components/ui/skeleton'
import { Link } from '@adonisjs/inertia/react'
import { Data } from '@generated/data'
import { Fragment } from 'react'
import { Separator } from '@/shared/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

type Props = {
  posts?: Data.Posts.Post.Variants['homePosts'][]
  error?: string
}

export function HomeLatestPosts({ posts, error }: Props) {
  if ((!posts && !Array.isArray(posts)) || error) return <LatestPostsError message={error} />

  if (posts.length === 0) {
    return <div className="italic text-center">Aucun article pour le moment !</div>
  }

  const latestPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <Link
        route="news.single"
        routeParams={{ slug: latestPost.slug }}
        className="hover:text-primary"
      >
        <div className="space-y-3 ">
          <img
            src={latestPost.coverImageUrl ?? '/assets/images/logo.webp'}
            className="aspect-video w-full object-cover shadow-xs md:aspect-2/2"
            width={500}
            height={300}
            alt={latestPost.title}
            loading="lazy"
          />
          {latestPost.category && <Badge className="uppercase">{latestPost.category}</Badge>}
          <h4>{latestPost.title}</h4>
        </div>

        <time className=" text-sm text-muted-foreground">
          {latestPost.publishedAt ? formatDate(latestPost.publishedAt) : null}
        </time>
      </Link>

      <Separator className="block md:hidden data-horizontal:h-1" />

      <div className="flex flex-col gap-5">
        {otherPosts.map((post, index) => (
          <Fragment key={post.id}>
            <div className="space-y-3">
              <Link
                route="news.single"
                routeParams={{ slug: post.slug }}
                className="contents hover:text-primary"
              >
                {post.category && <Badge className="uppercase">{post.category}</Badge>}
                <h4>{post.title}</h4>
                <time className="text-sm text-muted-foreground">
                  {post.publishedAt ? formatDate(post.publishedAt) : null}
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

export function LatestPostsSkeleton() {
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

function LatestPostsError({
  message = 'Le chargement des dernières actualités a échoué. Cela peut être dû à une erreur réseau ou à un problème interne.',
}: {
  message?: string
}) {
  return (
    <div className="col-span-2">
      <Alert variant="destructive" className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertCircleIcon />
          <AlertTitle>Échec du chargement</AlertTitle>
        </div>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}
