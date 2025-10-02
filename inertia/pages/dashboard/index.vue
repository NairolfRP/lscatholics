<template>
  <Head title="Tableau de bord" />

  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Tableau de bord</h1>
      <p class="text-gray-500 dark:text-gray-400">Bienvenue dans votre espace d'administration</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="stat in statsAttributes" :key="stat.value">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium">
            {{ stat.label }}
          </CardTitle>
          <component :is="stat.icon" :class="['h-4 w-4', stat.color]" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats[stat.value] }}</div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-gray-500">Aucune activité récente</p>
      </CardContent>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { Head } from '@inertiajs/vue3'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Calendar, Users } from 'lucide-vue-next'

interface Props {
  stats: {
    articles: number
    events: number
    users: number
  }
}

defineProps<Props>()

const statsAttributes = [
  {
    label: 'Articles',
    value: 'articles' as const,
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    label: 'Événements',
    value: 'events' as const,
    icon: Calendar,
    color: 'text-green-600',
  },
  {
    label: 'Utilisateurs',
    value: 'users' as const,
    icon: Users,
    color: 'text-purple-600',
  },
]
</script>
