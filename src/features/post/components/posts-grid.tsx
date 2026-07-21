import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { AlertCircleIcon } from 'lucide-react'
import { Pagination } from '#/shared/components/pagination'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { cn } from '#/shared/lib/utils'
import { postsQueryOptions } from '#shared/queries/post.queries.ts'
import PostCard, { PostCardSkeleton } from './post-card'

export function PostsGrid() {
  const { page } = useSearch({ from: '/_app/newsroom' })
  const { data, isError, isLoading, refetch, isFetching } = useQuery(postsQueryOptions(page))

  if (isLoading) {
    return <PostsGridSkeleton />
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertCircleIcon />
        <AlertTitle>Service temporairement indisponible</AlertTitle>
        <AlertDescription>
          Impossible de charger les actualités. Réessayez dans quelques instants.
        </AlertDescription>
        <AlertAction>
          <Button size="xs" variant="default" onClick={() => refetch()}>
            Réessayer
          </Button>
        </AlertAction>
      </Alert>
    )
  }

  if (!data || data.posts.length === 0) {
    return <div className="mx-auto w-full text-center font-medium italic">Aucun article trouvé</div>
  }

  const totalPages = Math.ceil(data.total / 6)

  return (
    <>
      <div
        className={cn('grid gap-8 md:grid-cols-2 lg:grid-cols-3', {
          'pointer-events-none opacity-50': isFetching,
        })}
      >
        {data.posts.map((post) => (
          <PostCard
            key={post.id}
            slug={post.slug}
            title={post.title}
            image={post.coverImageUrl}
            category={post.category ?? undefined}
            publishedAt={post.publishedAt!.toISOString()}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </>
  )
}

export function PostsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
