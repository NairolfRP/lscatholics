<template>
  <Head title="Créer un article" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_articles.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Créer un article</h1>
        <p class="text-gray-500 dark:text-gray-400">Ajoutez un nouvel article à votre site</p>
      </div>
    </div>

    <form @submit.prevent="submit">
      <div class="grid gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>
                Renseignez les informations principales de l'article
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="title">Titre *</Label>
                <Input
                  id="title"
                  v-model="form.title"
                  placeholder="Titre de l'article"
                  required
                  @blur="!form.slug && generateSlug()"
                />
                <p v-if="form.errors.title" class="text-sm text-red-600">
                  {{ form.errors.title }}
                </p>
              </div>

              <div class="space-y-2">
                <Label for="slug">Slug</Label>
                <Input id="slug" v-model="form.slug" placeholder="url-de-larticle" />
                <p class="text-xs text-gray-500">Laissez vide pour générer automatiquement</p>
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
                  </SelectContent>
                </Select>
                <p v-if="form.errors.status" class="text-sm text-red-600">
                  {{ form.errors.status }}
                </p>
              </div>

              <div class="flex gap-2">
                <Button type="submit" :disabled="form.processing" class="flex-1">
                  {{ form.status === 'published' ? 'Publier' : 'Enregistrer' }}
                </Button>
                <Button type="button" variant="outline" as-child>
                  <Link :href="urlFor('dashboard.dashboard_articles.index')"> Annuler </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image à la une *</CardTitle>
            </CardHeader>
            <CardContent class="space-y-2">
              <Input
                id="featuredImage"
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
<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ArrowLeft } from 'lucide-vue-next'
import { hasRoute, urlFor } from '@/client'
import { MarkdownTextarea } from '@/shared/components/ui/markdown'

const form = useForm({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  status: 'draft' as 'draft' | 'published',
  coverImageUrl: '',
})

const submit = () => {
  if (!hasRoute('dashboard.dashboard_articles.store')) return

  form.post(urlFor('dashboard.dashboard_articles.store'))
}

const generateSlug = () => {
  form.slug = form.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
</script>
