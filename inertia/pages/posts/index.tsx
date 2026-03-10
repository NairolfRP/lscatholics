import Head from '@/shared/components/app-head'
import { router } from '@inertiajs/react'
import { CircleAlert } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import HeroSection from '@/shared/components/layout/default/hero-section'
import PostCard from '@/shared/components/post-card'
import { urlFor } from '@/client'
import type { Data } from '@generated/data'
import { InertiaProps } from '@/types'
import { getPaginationItems } from '@/lib/utils'

type PageProps = InertiaProps<{
  posts: {
    data: Data.Posts.Post.Variants['publicList'][]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  selectedCategory: string
  categories: Array<{ id: string; name: string; color: string }>
  error: boolean
}>

export default function NewsPage({ posts, selectedCategory, error }: PageProps) {
  const {
    total: totalItems,
    perPage: itemsPerPage,
    currentPage: page,
    firstPage,
    lastPage,
  } = posts.metadata

  const handlePageChange = (newPage: number) => {
    const p = Math.max(firstPage, Math.min(newPage, lastPage))
    router.get(
      urlFor('news.index'),
      { page: p, category: selectedCategory },
      { preserveScroll: true, only: ['posts', 'selectedCategory', 'error'] }
    )
  }

  return (
    <>
      <Head title="Actualités" />

      <HeroSection py="16">
        <Typography variant="h1" className="md:text-5xl font-bold mb-4">
          Actualités
        </Typography>
        <p className="text-xl opacity-90">Restez informé de la vie de notre archidiocèse</p>
      </HeroSection>

      <div className="container mx-auto max-w-7xl">
        <section className="py-16">
          {error && (
            <div className="max-w-4xl mx-auto px-3">
              <Alert variant="destructive">
                <CircleAlert />
                <AlertTitle>Impossible de charger les actualités</AlertTitle>
                <AlertDescription>
                  Nous n'avons pas pu récupérer les articles. Cela peut être dû à un problème
                  serveur ou réseau. Réessayez plus tard.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {!error && (!posts.data || posts.data.length === 0) && (
            <div className="w-full text-center mx-auto font-medium italic">
              Aucun article trouvé
            </div>
          )}

          {!error && posts.data && posts.data.length > 0 && (
            <div className="md:container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.data.map((post) => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    routeParams={{ slug: post.slug }}
                    category={post.category || undefined}
                    publishedAt={post.publishedAt || undefined}
                  />
                ))}
              </div>

              {totalItems > itemsPerPage && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(page - 1)}
                          aria-disabled={page <= firstPage}
                          className={
                            page <= firstPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {getPaginationItems(page, lastPage).map((item, index) =>
                        item === 'ellipsis' ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              isActive={item === page}
                              onClick={() => handlePageChange(item)}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(page + 1)}
                          aria-disabled={page >= lastPage}
                          className={
                            page >= lastPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
