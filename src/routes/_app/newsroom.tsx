import { createFileRoute, redirect, stripSearchParams } from '@tanstack/react-router'
import { PostsGrid } from '#/features/post/components/posts-grid'
import { postsQueryOptions } from '#/features/post/queries'
import { postsSearchSchema } from '#/features/post/schemas/post.schema'
import Hero from '#/shared/layouts/app/components/hero'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/newsroom')({
  validateSearch: postsSearchSchema,
  search: {
    middlewares: [stripSearchParams({ page: 1 })],
  },
  beforeLoad: async ({ context, search }) => {
    const { total } = await context.queryClient.ensureQueryData(postsQueryOptions(search.page))

    const totalPages = Math.ceil(total / 6)

    if (search.page > totalPages && totalPages > 0) {
      throw redirect({ to: '.', search: { page: totalPages } })
    }
  },
  head: () => ({
    meta: pageMetadata('Actualités'),
  }),
  component: PostsComponent,
})

function PostsComponent() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-red"
        title="Actualités"
        subtitle="Restez informé de la vie de notre archidiocèse"
      />

      <section className="container mx-auto px-2 pt-10 pb-20">
        <PostsGrid />
      </section>
    </>
  )
}
