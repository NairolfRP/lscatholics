import { InertiaProps } from '@/shared/types/pages'
import type { Data } from '@generated/data'
import { urlFor } from '@/lib/client'
import { router } from '@inertiajs/react'
import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Typography } from '@/shared/components/ui/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { getPaginationItems } from '@/lib/utils'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { ActionButton } from '@/shared/components/action-button'
import { withDashboardLayout } from '@/shared/components/layout'

type PageProps = InertiaProps<{
  posts: {
    data: Data.Posts.Post[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
  filters: { search: string }
}>

export default withDashboardLayout<PageProps>(
  ({ posts, filters }) => {
    const [search, setSearch] = useState<string>(filters.search ?? '')

    const handleSearch = useDebouncedCallback((v: string) => {
      router.get(
        urlFor('dashboard.dashboard_posts.index'),
        { search: v || undefined },
        {
          only: ['posts', 'filters'],
          preserveState: true,
          preserveScroll: true,
          replace: true,
        }
      )
    }, 300)

    const handleChangePage = useDebouncedCallback((newPage: number) => {
      router.get(
        urlFor('dashboard.dashboard_posts.index'),
        { search: search || undefined, page: !newPage || newPage <= 1 ? undefined : newPage },
        {
          preserveState: true,
          preserveScroll: true,
        }
      )
    }, 300)

    const deletePost = (id: number) => {
      router.delete(urlFor('dashboard.dashboard_posts.destroy', { id }))
    }

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    return (
      <>
        <Head title="Articles" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
              <p className="text-gray-500 dark:text-gray-400">Gérez les articles sur le site</p>
            </div>
            <Button asChild>
              <Link route="dashboard.dashboard_posts.create">
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des articles</CardTitle>
              <CardDescription> {posts.metadata.total} article(s) au total</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                value={search ?? ''}
                onChange={(e) => {
                  setSearch(e.target.value)
                  handleSearch(e.target.value)
                }}
                placeholder="Rechercher..."
              />
              {posts.data.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.data.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">
                            <Link
                              route="dashboard.dashboard_posts.show"
                              routeParams={{ id: post.id }}
                              className="hover:underline"
                            >
                              {post.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.status === 'published'
                                  ? 'default'
                                  : post.status === 'draft'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {post.status === 'published'
                                ? 'Publié'
                                : post.status === 'draft'
                                  ? 'Brouillon'
                                  : 'Archivé'}
                            </Badge>
                          </TableCell>
                          <TableCell>{post.createdAt ? formatDate(post.createdAt) : ''}</TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" as-child>
                                <Link
                                  route="dashboard.dashboard_posts.edit"
                                  routeParams={{ id: post.id }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <ActionButton
                                variant="ghost"
                                size="icon"
                                areYouSureTitle="Êtes-vous sûr de vouloir supprimer cet article ?"
                                action={deletePost.bind(null, post.id)}
                                requireAreYouSure
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </ActionButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handleChangePage(posts.metadata.currentPage - 1)}
                          aria-disabled={posts.metadata.currentPage <= posts.metadata.firstPage}
                          className={
                            posts.metadata.currentPage <= posts.metadata.firstPage
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {getPaginationItems(posts.metadata.currentPage, posts.metadata.lastPage).map(
                        (item, index) =>
                          item === 'ellipsis' ? (
                            <PaginationItem key={`ellipsis-${index}`}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          ) : (
                            <PaginationItem key={item}>
                              <PaginationLink
                                isActive={item === posts.metadata.currentPage}
                                onClick={() => handleChangePage(item)}
                                className="cursor-pointer"
                              >
                                {item}
                              </PaginationLink>
                            </PaginationItem>
                          )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handleChangePage(posts.metadata.currentPage + 1)}
                          aria-disabled={posts.metadata.currentPage >= posts.metadata.lastPage}
                          className={
                            posts.metadata.currentPage >= posts.metadata.lastPage
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              ) : (
                <Typography variant="small" className="mt-5">
                  Aucun résultat
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    )
  },
  {
    breadcrumb: [{ label: 'Articles' }],
  }
)
