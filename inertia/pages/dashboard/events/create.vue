<template>
  <DashboardLayout>
    <Head title="Créer un événement" />

    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" as-child>
          <Link :href="tuyau.$url('dashboard.dashboard_events.index')">
            <ArrowLeft class="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Créer un événement</h1>
          <p class="text-gray-500 dark:text-gray-400">
            Organisez un nouvel événement pour votre communauté
          </p>
        </div>
      </div>

      <form @submit.prevent="submit">
        <div class="grid gap-6 lg:grid-cols-3">
          <div class="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription> Détails de base de l'événement </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="space-y-2">
                  <Label for="title">Titre *</Label>
                  <Input
                    id="title"
                    v-model="form.title"
                    placeholder="Titre de l'événement"
                    required
                    @blur="!form.slug && generateSlug()"
                  />
                  <p v-if="form.errors.title" class="text-sm text-red-600">
                    {{ form.errors.title }}
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="slug">Slug</Label>
                  <Input id="slug" v-model="form.slug" placeholder="url-de-levenement" />
                  <p class="text-xs text-gray-500">Laissez vide pour générer automatiquement</p>
                  <p v-if="form.errors.slug" class="text-sm text-red-600">
                    {{ form.errors.slug }}
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="description">Description *</Label>
                  <Textarea
                    id="description"
                    v-model="form.description"
                    placeholder="Résumé de l'événement"
                    :rows="3"
                    required
                  />
                  <p v-if="form.errors.description" class="text-sm text-red-600">
                    {{ form.errors.description }}
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="parishId">Paroisse</Label>
                  <Select
                    :value="form.parishId"
                    @update:model-value="
                      (value) => {
                        if (value === 'null') {
                          form.parishId = undefined
                          return
                        }
                        form.parishId = Number(value)
                      }
                    "
                  >
                    <SelectTrigger>
                      <SelectValue id="parishId" placeholder="Aucune" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="null"> Aucune </SelectItem>
                        <SelectItem v-for="parish of parishes" :key="parish.id" :value="parish.id">
                          {{ parish.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p v-if="form.errors.parishId" class="text-sm text-red-600">
                    {{ form.errors.parishId }}
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="location">Lieu</Label>
                  <Input
                    id="location"
                    v-model="form.location"
                    placeholder="Adresse ou lieu de l'événement"
                  />
                  <p v-if="form.errors.location" class="text-sm text-red-600">
                    {{ form.errors.location }}
                  </p>
                </div>

                <div class="space-y-2">
                  <Label for="content">Contenu *</Label>
                  <MarkdownTextarea
                    id="content"
                    v-model="form.content"
                    placeholder="Description de l'événement"
                    :rows="12"
                    required
                  />
                  <p v-if="form.errors.content" class="text-sm text-red-600">
                    {{ form.errors.content }}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates et horaires</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="grid gap-4 md:grid-cols-2">
                  <div class="space-y-2">
                    <Label for="startDate">Date de début *</Label>
                    <DateTimePicker id="startDate" v-model="form.startDate" required />
                    <p v-if="form.errors.startDate" class="text-sm text-red-600">
                      {{ form.errors.startDate }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <Label for="endDate">Date de fin</Label>
                    <DateTimePicker id="endDate" v-model="form.endDate" />
                    <p v-if="form.errors.endDate" class="text-sm text-red-600">
                      {{ form.errors.endDate }}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div class="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent class="space-y-4">
                <div class="flex gap-2 items-center">
                  <Checkbox id="registrationRequired" v-model="form.registrationRequired" />
                  <Label for="registrationRequired">Inscription requise</Label>
                </div>
                <div v-if="form.registrationRequired" class="space-y-2">
                  <Label for="maxParticipants">Nombre max de participants</Label>
                  <Input
                    id="maxParticipants"
                    v-model.number="form.maxParticipants"
                    type="number"
                    min="1"
                    placeholder="Illimité si vide"
                  />
                  <p class="text-xs text-gray-500">Laissez vide pour un nombre illimité</p>
                </div>

                <div class="flex gap-2">
                  <Button type="submit" :disabled="form.processing" class="flex-1">
                    Créer l'événement
                  </Button>
                  <Button type="button" variant="outline" as-child>
                    <Link :href="tuyau.$url('dashboard.dashboard_events.index')"> Annuler </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image de couverture</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2">
                <Input
                  id="coverImage"
                  v-model="form.coverImageUrl"
                  placeholder="URL de l'image"
                  type="url"
                />
                <div
                  v-if="form.coverImageUrl"
                  class="mt-4 aspect-video w-full overflow-hidden rounded-lg border"
                >
                  <img :src="form.coverImageUrl" alt="Aperçu" class="h-full w-full object-cover" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flyer</CardTitle>
              </CardHeader>
              <CardContent class="space-y-2">
                <Input
                  id="coverImage"
                  v-model="form.flyerUrl"
                  placeholder="URL de l'image"
                  type="url"
                />
                <div
                  v-if="form.flyerUrl"
                  class="mt-4 aspect-video w-full overflow-hidden rounded-lg border"
                >
                  <img :src="form.flyerUrl" alt="Aperçu" class="h-full w-full object-cover" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
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
import { ArrowLeft } from 'lucide-vue-next'
import { tuyau } from '@/lib/tuyau'
import { MarkdownTextarea } from '@/shared/components/ui/markdown'
import { parishes } from '@/shared/constants/parishes.constants'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { DateTimePicker } from '@/shared/components/ui/datetime-picker'

const form = useForm({
  title: '',
  slug: '',
  description: '',
  content: '',
  location: '',
  parishId: undefined as number | undefined,
  coverImageUrl: '',
  flyerUrl: '',
  registrationRequired: false,
  maxParticipants: undefined as number | undefined,
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
})

const submit = () => {
  form.post(tuyau.$url('dashboard.dashboard_events.store'))
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
