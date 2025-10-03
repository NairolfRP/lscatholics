<template>
  <Head title="Modifier l'article" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="tuyau.$url('dashboard.dashboard_articles.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Modifier l'article</h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ article.title }}
        </p>
      </div>
    </div>

    <form @submit.prevent="submit">
      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Formulaire principal -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription> Modifiez les informations de l'article </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="title">Titre *</Label>
                <Input id="title" v-model="form.title" placeholder="Titre de l'article" required />
                <p v-if="form.errors.title" class="text-sm text-red-600">
                  {{ form.errors.title }}
                </p>
              </div>

              <div class="space-y-2">
                <Label for="slug">Slug</Label>
                <Input id="slug" v-model="form.slug" placeholder="url-de-larticle" />
                <p v-if="form.errors.slug" class="text-sm text-red-600">
                  {{ form.errors.slug }}
                </p>
              </div>

              <div class="space-y-2">
                <Label for="excerpt">Extrait</Label>
                <Textarea
                  id="excerpt"
                  v-model="form.excerpt"
                  placeholder="Résumé de l'article"
                  :rows="3"
                />
                <p v-if="form.errors.excerpt" class="text-sm text-red-600">
                  {{ form.errors.excerpt }}
                </p>
              </div>

              <div class="space-y-2">
                <Label for="content">Contenu *</Label>
                <MarkdownTextarea
                  id="content"
                  v-model="form.content"
                  placeholder="Contenu de l'article"
                  :rows="12"
                  required
                />
                <p v-if="form.errors.content" class="text-sm text-red-600">
                  {{ form.errors.content }}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="status">Statut</Label>
                <Select v-model="form.status">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="form.errors.status" class="text-sm text-red-600">
                  {{ form.errors.status }}
                </p>
              </div>

              <div class="flex gap-2">
                <Button type="submit" :disabled="form.processing" class="flex-1">
                  Mettre à jour
                </Button>
                <Button type="button" variant="outline" as-child>
                  <Link :href="tuyau.$url('dashboard.dashboard_articles.index')"> Annuler </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image à la une</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Input
                id="coverImageUrl"
                v-model="form.coverImageUrl"
                placeholder="URL de l'image"
                type="url"
              />
              <p v-if="form.errors.coverImageUrl" class="text-sm text-red-600">
                {{ form.errors.coverImageUrl }}
              </p>
              <div
                v-if="form.coverImageUrl"
                class="mt-4 aspect-video w-full overflow-hidden rounded-lg border"
              >
                <img :src="form.coverImageUrl" alt="Aperçu" class="h-full w-full object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
import { Head, Link, useForm } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-vue-next'
import { tuyau } from '@/lib/tuyau'
import { MarkdownTextarea } from '@/components/ui/markdown'

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published'
  coverImageUrl: string | null
}

type Props = {
  article: Article
}

const props = defineProps<Props>()

const form = useForm({
  title: props.article.title,
  slug: props.article.slug,
  excerpt: props.article.excerpt,
  content: props.article.content,
  status: props.article.status,
  coverImageUrl: props.article.coverImageUrl || '',
})

const submit = () => {
  form.put(tuyau.$url('dashboard.dashboard_articles.update', { params: { id: props.article.id } }))
}
</script>
