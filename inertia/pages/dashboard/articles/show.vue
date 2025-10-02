<template>
  <Head :title="article.title" />

  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" as-child>
          <Link :href="tuyau.$url('dashboard.dashboard_articles.index')">
            <ArrowLeft class="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">{{ article.title }}</h1>
          <p class="text-gray-500 dark:text-gray-400">
            Par {{ article.author?.name || 'un auteur inconnu' }} ·
            {{ formatDate(article.createdAt) }}
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <Link
            :href="tuyau.$url('news.single', { params: { slug: article.slug } })"
            target="_blank"
          >
            <Eye class="mr-2 h-4 w-4" />
            Voir
          </Link>
        </Button>
        <Button as-child>
          <Link
            :href="tuyau.$url('dashboard.dashboard_articles.edit', { params: { id: article.id } })"
          >
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
                {{ tuyau.$url('news.single', { params: { slug: article.slug } }) }}
              </code>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Auteur</p>
              <p>{{ article.author?.name || 'Inconnu' }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Créé le</p>
              <p>{{ formatDate(article.createdAt) }}</p>
            </div>
            <div>
              <p class="font-medium text-gray-500 dark:text-gray-400">Modifié le</p>
              <p>{{ formatDate(article.updatedAt) }}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Eye } from 'lucide-vue-next'
import { tuyau } from '@/lib/tuyau'
import { MarkdownContent } from '@/components/ui/markdown'

interface Article {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  coverImageUrl: string | null
  author: {
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Props {
  article: Article
}

defineProps<Props>()

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
