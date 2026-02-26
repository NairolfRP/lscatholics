<template>
  <Head :title="article.title" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" as-child>
          <Link :href="urlFor('dashboard.dashboard_articles.index')">
            <ArrowLeft class="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ article.title }}</h1>
          <p class="text-gray-500 dark:text-gray-400">
            Par {{ article.author?.name || 'un auteur inconnu' }} ·
            {{ article.createdAt ? formatDate(article.createdAt) : '' }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <Link :href="urlFor('news.single', { slug: article.slug })" target="_blank">
            <Eye class="mr-2 h-4 w-4" />
            Voir
          </Link>
        </Button>
        <Button as-child>
          <Link :href="urlFor('dashboard.dashboard_articles.edit', { id: article.id })">
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
            <div class="flex items-center justify-between">
              <CardTitle>Contenu</CardTitle>
              <Badge :variant="article.status === 'published' ? 'default' : 'secondary'">
                {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
              </Badge>
            </div>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-if="article.coverImageUrl"
              class="aspect-video w-full overflow-hidden rounded-lg"
            >
              <img
                :src="article.coverImageUrl"
                :alt="article.title"
                class="h-full w-full object-cover"
              />
            </div>

            <div v-if="article.excerpt" class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ article.excerpt }}
              </p>
            </div>

            <div class="prose prose-gray max-w-none dark:prose-invert">
              <MarkdownContent :content="article.content" />
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
                {{ urlFor('news.single', { slug: article.slug }) }}
              </code>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Auteur</p>
              <p>{{ article.author?.name || 'Inconnu' }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Créé le</p>
              <p>{{ article.createdAt ? formatDate(article.createdAt) : 'Date inconnue' }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Modifié le</p>
              <p>{{ article.updatedAt ? formatDate(article.updatedAt) : 'Jamais' }}</p>
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
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps<{
  article: Data.News.Variants['allFields']
}>

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
