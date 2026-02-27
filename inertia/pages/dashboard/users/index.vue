<template>
  <Head title="Liste des utilisateurs" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Utilisateurs</h1>
        <p class="text-gray-500 dark:text-gray-400">Page OOC. Gérez les utilisateurs du site.</p>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
        <CardDescription> {{ users.metadata.total }} utilisateur(s) au total </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Input v-model="search" placeholder="Rechercher par nom d'utilisateur..." />
        <template v-if="users.data.length > 0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom d'utilisateur GTAW</TableHead>
                <TableHead>Rôle(s)</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="itemUser in users.data" :key="itemUser.id">
                <TableCell class="font-medium">
                  <Link
                    :href="urlFor('dashboard.dashboard_users.edit', { id: itemUser.id })"
                    class="hover:underline"
                  >
                    {{ itemUser.name }}
                  </Link>
                </TableCell>
                <TableCell>
                  <div class="flex flex-col gap-2">
                    <div class="flex flex-wrap gap-2">
                      <Badge v-for="role in itemUser.roles" :key="role.slug">{{ role.name }}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {{ itemUser.createdAt ? formatDate(itemUser.createdAt) : '' }}
                </TableCell>
                <TableCell class="text-right">
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" as-child>
                      <Link :href="urlFor('dashboard.dashboard_users.edit', { id: itemUser.id })">
                        <Edit class="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      v-if="user?.id !== itemUser.id && permissions.includes('deleteUsers')"
                      variant="ghost"
                      size="icon"
                      @click="deleteUser(itemUser.id)"
                    >
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination
            v-slot="{ page }"
            :items-per-page="users.metadata.perPage"
            :total="users.metadata.total"
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
import { InertiaProps } from '@/types'
import { Data } from '@generated/data'
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Head, Link, router } from '@inertiajs/vue3'
import { urlFor } from '@/client'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
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
import { Edit, Trash2 } from 'lucide-vue-next'
import { Input } from '@/shared/components/ui/input'
import { Typography } from '@/shared/components/ui/typography'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useUser } from '@/shared/composables/use_user'
import { usePageProps } from '@/shared/composables/use_page_props'

type PageProps = InertiaProps<{
  users: {
    data: Data.Users.User.Variants['withRoles'][]
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

const props = defineProps<PageProps>()
const page = usePageProps<{ permissions: string[] }>()

const permissions = page.value.permissions

const user = useUser()

const search = ref(props.filters.search)

const performSearch = useDebounceFn(() => {
  router.get(
    urlFor('dashboard.dashboard_users.index'),
    { search: search.value || undefined },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const handleChangePage = useDebounceFn((page: number) => {
  router.get(
    urlFor('dashboard.dashboard_users.index'),
    { search: search.value || undefined, page: !page || page <= 1 ? undefined : page },
    { preserveState: true, preserveScroll: true }
  )
}, 300)

const deleteUser = (id: number) => {
  if (user.value?.id === id || !permissions.includes('deleteUsers')) return
  if (
    confirm(
      "Attention. La suppression est définitive, immédiate et sensible. Assurez-vous d'avoir de bonnes raisons. Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
    )
  ) {
    router.delete(urlFor('dashboard.dashboard_users.destroy', { id }))
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
