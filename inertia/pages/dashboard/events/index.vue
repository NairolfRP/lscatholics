<template>
  <Head title="Événements" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Événements</h1>
        <p class="text-gray-500 dark:text-gray-400">Gérez les événements de votre communauté</p>
      </div>
      <Button as-child>
        <Link :href="urlFor('dashboard.dashboard_events.create')">
          <Plus class="mr-2 h-4 w-4" />
          Nouvel événement
        </Link>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Liste des événements</CardTitle>
            <CardDescription> {{ events.metadata.total }} événement(s) au total </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <template v-if="events.data.length > 0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Max participants</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="event in events.data" :key="event.id">
                <TableCell class="font-medium">
                  <Link
                    :href="urlFor('dashboard.dashboard_events.show', { id: event.id })"
                    class="hover:underline"
                  >
                    {{ event.title }}
                  </Link>
                </TableCell>
                <TableCell>
                  {{ event.location || 'Non spécifié' }}
                </TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <CalendarIcon class="h-4 w-4 text-gray-400" />
                    {{ event.startDate ? formatDate(event.startDate) : 'Date inconnue' }}
                  </div>
                </TableCell>
                <TableCell>
                  <span v-if="event.maxParticipants" class="text-sm">
                    {{ event.maxParticipants }}
                  </span>
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" as-child>
                      <Link :href="urlFor('dashboard.dashboard_events.edit', { id: event.id })">
                        <Edit class="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" @click="deleteEvent(event.id)">
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Pagination
            v-slot="{ page }"
            :items-per-page="events.metadata.perPage"
            :total="events.metadata.total"
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
<script lang="ts" setup>
import { Head, Link, router } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { urlFor } from '@/client'
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
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-vue-next'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { Typography } from '@/shared/components/ui/typography'
import { useDebounceFn } from '@vueuse/core'
import type { InertiaProps } from '@/types'
import { Data } from '@generated/data'

type PageProps = InertiaProps<{
  events: {
    data: Data.Event[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
    }
  }
}>

defineProps<PageProps>()

const handleChangePage = useDebounceFn((page: number) => {
  router.get(
    urlFor('dashboard.dashboard_events.index'),
    { page: !page || page <= 1 ? undefined : page },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const deleteEvent = (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
    router.delete(urlFor('dashboard.dashboard_events.destroy', { id }))
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
