import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Markdown } from '#/shared/components/ui/markdown'
import Hero from '#/shared/layouts/app/components/hero'
import { formatDate } from '#/utils/date'
import { pageMetadata } from '#/utils/seo'
import { postQueryOptions } from '#shared/queries/post.queries.ts'

export const Route = createFileRoute('/_app/post/$slug')({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(postQueryOptions(params.slug))
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return {
      meta: pageMetadata(loaderData.title, {
        metadata: {
          ...(loaderData.coverImageUrl ? { image: loaderData.coverImageUrl } : {}),
          ...(loaderData.excerpt ? { description: loaderData.excerpt } : {}),
          article: {
            publishedTime: loaderData.publishedAt ? loaderData.publishedAt.toISOString() : '',
            modifiedTime: loaderData.updatedAt.toISOString(),
            ...(loaderData.category ? { section: loaderData.category } : {}),
          },
        },
        overrides: [
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        ],
      }),
    }
  },
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const { data: post } = useSuspenseQuery(postQueryOptions(slug))
  return (
    <article>
      <header>
        <Hero
          variant="image"
          size="md"
          imageSrc={post.coverImageUrl}
          imageAlt={`Image de couverture - Article "${post.title}"`}
          title={post.title}
          subtitle={
            post.publishedAt ? (
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            ) : undefined
          }
        />
      </header>

      <div className="mx-auto flex max-w-200 flex-col px-2 pt-10 pb-20 lg:px-0">
        <div className="space-y-8 text-justify">
          <div>
            <span className="block font-bold uppercase">Pour diffusion immédiate —</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            )}
          </div>

          <Markdown content={post.content} />
        </div>
      </div>
    </article>
  )
}
