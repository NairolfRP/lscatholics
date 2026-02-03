<template>
  <Head title="Offres d'emplois" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Offres d'emplois</h1>
        <p class="text-gray-500 dark:text-gray-400">Gérez les offres d'emplois</p>
      </div>
      <Button as-child>
        <Link :href="tuyau.$url('dashboard.dashboard_jobs.create')">
          <Plus class="mr-2 h-4 w-4" />
          Nouvelle offre
        </Link>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Liste des offres d'emplois</CardTitle>
        <CardDescription> {{ jobs.meta.total }} offre(s) au total </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Input v-model="search" placeholder="Rechercher..." />
        <template v-if="jobs.data.length > 0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Postée le</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="job in jobs.data" :key="job.id">
                <TableCell class="font-medium">
                  <Link
                    :href="
                      tuyau.$url('dashboard.dashboard_jobs.show', {
                        params: { id: job.id },
                      })
                    "
                    class="hover:underline"
                  >
                    {{ job.title }}
                  </Link>
                </TableCell>
                <TableCell>{{ formatDate(job.postedAt) }}</TableCell>
                <TableCell>
                  <Badge :variant="job.isActive ? 'default' : 'destructive'">
                    {{ job.isActive ? 'Actif' : 'Fermée' }}
                  </Badge>
                </TableCell>

                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" as-child>
                      <Link
                        :href="
                          tuyau.$url('dashboard.dashboard_jobs.edit', {
                            params: { id: job.id },
                          })
                        "
                      >
                        <Edit class="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" @click="deleteJob(job.id)">
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination
            v-slot="{ page }"
            :items-per-page="jobs.meta.per_page"
            :total="jobs.meta.total"
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
import { Button } from '@/shared/components/ui/button'
import { tuyau } from '@/lib/tuyau'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Input } from '@/shared/components/ui/input'
import { Typography } from '@/shared/components/ui/typography'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'

interface Job {
  id: number
  title: string
  isActive: boolean
  postedAt: string
}

interface Props {
  jobs: {
    data: Job[]
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
    tuyau.$url('dashboard.dashboard_jobs.index'),
    { search: search.value || undefined },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const handleChangePage = useDebounceFn((page: number) => {
  router.get(
    tuyau.$url('dashboard.dashboard_jobs.index'),
    { search: search.value || undefined, page: !page || page <= 1 ? undefined : page },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const deleteJob = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
    router.delete(tuyau.$url('dashboard.dashboard_jobs.destroy', { params: { id } }))
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
