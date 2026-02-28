<template>
  <Head :title="event.title" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" as-child>
          <Link :href="urlFor('dashboard.dashboard_events.index')">
            <ArrowLeft class="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ event.title }}</h1>
          <p class="text-gray-500 dark:text-gray-400">
            {{ event.startDate ? formatDate(event.startDate) : 'Date inconnue' }}
            {{ event.endDate && `— ${formatDate(event.endDate)}` }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <Link :href="urlFor('event', { slug: event.slug })" target="_blank">
            <Eye class="mr-2 h-4 w-4" />
            Voir
          </Link>
        </Button>
        <Button as-child>
          <Link :href="urlFor('dashboard.dashboard_events.edit', { id: event.id })">
            <Edit class="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </Button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div v-if="event.coverImageUrl" class="aspect-video w-full overflow-hidden rounded-lg">
              <img
                :src="event.coverImageUrl"
                :alt="event.title"
                class="h-full w-full object-cover"
              />
            </div>

            <div v-if="event.flyerUrl" class="aspect-video w-full overflow-hidden rounded-lg">
              <img
                :src="event.flyerUrl"
                alt="Flyer de l'événement"
                class="h-full w-full object-cover"
              />
            </div>

            <div v-if="event.description" class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ event.description }}
              </p>
            </div>

            <div class="prose prose-gray max-w-none dark:prose-invert">
              <MarkdownContent :content="event.content" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3 text-sm">
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">URL</p>
              <code class="text-xs bg-gray-100 px-2 py-1 rounded dark:bg-gray-800">
                {{ urlFor('event', { slug: event.slug }) }}
              </code>
            </div>
            <div v-if="event.registrationRequired" class="flex items-center gap-2">
              <Badge variant="secondary"> Inscription requise </Badge>
              <Badge variant="outline">
                Max participants: {{ event.maxParticipants || 'Illimité' }}
              </Badge>
            </div>
            <div v-if="event.parishId">
              <p class="font-medium text-gray-500 dark:text-gray-400">Paroisse</p>
              <p>{{ parishes.find((p) => p.id == event.parishId)?.name || 'Paroisse invalide' }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Date de l'événement</p>
              <p>{{ event.startDate ? formatDate(event.startDate) : 'Date inconnue' }}</p>
            </div>
            <div v-if="event.endDate">
              <p class="font-medium text-gray-500 dark:text-gray-400">Fin de l'événement</p>
              <p>{{ formatDate(event.endDate) }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Créé le</p>
              <p>{{ event.createdAt ? formatDate(event.createdAt) : 'Date inconnue' }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Modifié le</p>
              <p>{{ event.updatedAt ? formatDate(event.updatedAt) : 'Jamais' }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { ArrowLeft, Edit, Eye } from 'lucide-vue-next'
import { urlFor } from '@/client'
import { MarkdownContent } from '@/shared/components/ui/markdown'
import { parishes } from '@/shared/constants/parishes.constants'
import type { Data } from '@generated/data'

type PageProps = {
  event: Data.ScheduledEvents.ScheduledEvent.Variants['allFields']
}

defineProps<PageProps>()

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
