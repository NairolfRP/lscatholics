import { Typography } from '@/shared/components/ui/typography'
import { WhenVisible } from '@inertiajs/react'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { CircleAlert } from 'lucide-react'
import PostCard from '@/shared/components/post-card'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { urlFor } from '@/lib/client'
import { Container } from '@/shared/components/ui/container'
import { Data } from '@generated/data'
import { POSTS_SKELETON_COUNT } from '@/features/home/constants/home.constants'

type Props = {
  posts?: Data.Posts.Post.Variants['homePosts'][]
  error?: string
}

function PostsError({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

function PostsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-8 items-stretch">
      {Array.from({ length: POSTS_SKELETON_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}

function PostsGrid({ posts, error }: Props) {
  if (error) return <PostsError message={error} />

  if (!posts?.length) {
    return <div className="italic text-center">Aucun article pour le moment !</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 items-stretch">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          routeParams={{ slug: post.slug }}
          category={post.category ?? undefined}
          publishedAt={post.publishedAt ?? ''}
        />
      ))}
    </div>
  )
}

export function HomeLatestPosts({ posts, error }: Props) {
  return (
    <Container as="section" spacing="md">
      <div className="text-center mb-12">
        <Typography
          variant="h2"
          className="border-none text-3xl md:text-4xl font-bold text-catholic-purple mb-4 font-serif"
        >
          Actualités de l'Archidiocèse
        </Typography>
        <div className="w-24 h-1 bg-catholic-gold mx-auto cross-divider" />
      </div>

      <WhenVisible data="posts" fallback={<PostsSkeleton />}>
        <PostsGrid posts={posts} error={error} />
      </WhenVisible>

      {(posts?.length ?? 0) > 0 && (
        <div className="text-center mt-8">
          <Button variant="default" size="lg" className="cursor-pointer" asChild>
            <Link href={urlFor('news.index')}>Voir toutes les actualités</Link>
          </Button>
        </div>
      )}
    </Container>
  )
}
