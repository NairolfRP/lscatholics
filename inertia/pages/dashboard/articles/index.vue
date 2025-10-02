<template>
  <Head title="Articles" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Articles</h1>
        <p class="text-gray-500 dark:text-gray-400">Gérez les articles de votre site</p>
      </div>
      <Button as-child>
        <Link :href="tuyau.$url('dashboard.dashboard_articles.create')">
          <Plus class="mr-2 h-4 w-4" />
          Nouvel article
        </Link>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Liste des articles</CardTitle>
        <CardDescription> {{ articles.meta.total }} article(s) au total </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Input v-model="search" placeholder="Rechercher..." />
        <template v-if="articles.data.length > 0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="article in articles.data" :key="article.id">
                <TableCell class="font-medium">
                  <Link
                    :href="
                      tuyau.$url('dashboard.dashboard_articles.show', {
                        params: { id: article.id },
                      })
                    "
                    class="hover:underline"
                  >
                    {{ article.title }}
                  </Link>
                </TableCell>
                <TableCell v-if="article.author?.name">{{ article.author.name }}</TableCell>
                <TableCell v-else>Inconnu</TableCell>
                <TableCell>
                  <Badge
                    :variant="
                      article.status === 'published'
                        ? 'default'
                        : article.status === 'draft'
                          ? 'secondary'
                          : 'outline'
                    "
                  >
                    {{
                      article.status === 'published'
                        ? 'Publié'
                        : article.status === 'draft'
                          ? 'Brouillon'
                          : 'Archivé'
                    }}
                  </Badge>
                </TableCell>
                <TableCell>{{ formatDate(article.createdAt) }}</TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" as-child>
                      <Link
                        :href="
                          tuyau.$url('dashboard.dashboard_articles.edit', {
                            params: { id: article.id },
                          })
                        "
                      >
                        <Edit class="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" @click="deleteArticle(article.id)">
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination
            v-slot="{ page }"
            :items-per-page="articles.meta.per_page"
            :total="articles.meta.total"
            @update:page="handleChangePage"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationPrevious />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                >
                  {{ item.value }}
                </PaginationItem>
              </template>

              <PaginationEllipsis :index="4" />

              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </template>
        <Typography v-else variant="small" class="mt-5">Aucun résultat</Typography>
      </CardContent>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { tuyau } from '@/lib/tuyau'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Input } from '@/components/ui/input'
import { Typography } from '@/components/ui/typography'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface Article {
  id: number
  title: string
  status: 'draft' | 'published' | 'archived'
  author: {
    name: string
  }
  createdAt: string
}

interface Props {
  articles: {
    data: Article[]
    meta: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  }
  filters: { search: string }
}

const props = defineProps<Props>()

const search = ref(props.filters.search)

const performSearch = useDebounceFn(() => {
  router.get(
    tuyau.$url('dashboard.dashboard_articles.index'),
    { search: search.value || undefined },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const handleChangePage = useDebounceFn((page: number) => {
  router.get(
    tuyau.$url('dashboard.dashboard_articles.index'),
    { search: search.value || undefined, page: !page || page <= 1 ? undefined : page },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const deleteArticle = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
    router.delete(tuyau.$url('dashboard.dashboard_articles.destroy', { params: { id } }))
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

watch(search, performSearch)
</script>
