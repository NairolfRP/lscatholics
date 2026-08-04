import { useQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { AlertCircleIcon, NewspaperIcon } from 'lucide-react'
import { Pagination } from '#/shared/components/pagination'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { Spinner } from '#/shared/components/ui/spinner'
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
    return <PostsGridEmpty />
  }

  const totalPages = Math.ceil(data.total / 6)

  return (
    <div className="space-y-12">
      <div aria-busy={isFetching}>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.posts.map((post) => (
            <PostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              image={post.coverImageUrl}
              category={post.category ?? undefined}
              excerpt={post.excerpt ?? undefined}
              publishedAt={post.publishedAt?.toISOString()}
            />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {isFetching && (
            <Spinner
              role="status"
              aria-label="Chargement des articles"
              className="size-4 text-muted-foreground"
            />
          )}
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}

export function PostsGridSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

function PostsGridEmpty() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <NewspaperIcon className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">Aucun article publié</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Les prochaines actualités de l'archidiocèse apparaîtront ici.
        </p>
      </div>
    </div>
  )
}
