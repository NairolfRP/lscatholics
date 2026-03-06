<template>
  <form :id="DASHBOARD_POST_FORMS_ID.EDIT" @submit="onSubmit">
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
            <CardDescription> Modifiez les informations de l'article </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <VeeField v-slot="{ field, componentField, errors }" name="title">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel :for="field.name">Titre *</FieldLabel>
                  <Input
                    :id="field.name"
                    v-bind="componentField"
                    placeholder="Titre de l'article"
                    :aria-invalid="!!errors.length"
                    required
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <div class="space-y-2">
              <VeeField v-slot="{ field, componentField, errors }" name="slug">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel :for="field.name">Slug</FieldLabel>
                  <Input
                    :id="field.name"
                    v-bind="componentField"
                    placeholder="url-de-larticle"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldDescription>Laissez vide pour générer automatiquement</FieldDescription>
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <div class="space-y-2">
              <VeeField v-slot="{ field, componentField, errors }" name="excerpt">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel :for="field.name">Extrait</FieldLabel>
                  <Textarea
                    :id="field.name"
                    v-bind="componentField"
                    placeholder="Résumé de l'article"
                    :rows="3"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <div class="space-y-2">
              <VeeField v-slot="{ field, errors, setValue }" name="content">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel :for="field.name">Contenu</FieldLabel>
                  <MarkdownTextarea
                    :id="field.name"
                    :model-value="field.value"
                    @update:model-value="
                      (value) => {
                        setValue(value)
                      }
                    "
                    @change="field.onChange"
                    @blur="field.onBlur"
                    placeholder="Contenu de l'article"
                    :rows="12"
                    :aria-invalid="!!errors.length"
                    required
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
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
              <VeeField v-slot="{ field, errors }" name="status">
                <Field :data-invalid="!!errors.length">
                  <FieldContent>
                    <FieldLabel :for="field.name">Statut</FieldLabel>
                    <FieldError v-if="errors.length" :errors="errors" />
                  </FieldContent>
                  <Select
                    :model-value="field.value"
                    @update:model-value="field.onChange"
                    @blur="field.onBlur"
                  >
                    <SelectTrigger id="field.name" :aria-invalid="!!errors.length">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </VeeField>
            </div>

            <div v-if="form.values.status === 'published'" class="space-y-2">
              <VeeField v-slot="{ field, componentField, errors }" name="publishedAt">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel :for="field.name">Date de publication</FieldLabel>
                  <DateTimePicker
                    :id="field.name"
                    v-bind="componentField"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <div class="flex gap-2">
              <Button
                type="submit"
                :form="DASHBOARD_POST_FORMS_ID.EDIT"
                :disabled="form.isSubmitting.value"
                class="flex-1"
              >
                Mettre à jour
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
            <VeeField v-slot="{ field, componentField, errors }" name="coverImageUrl">
              <Field :data-invalid="!!errors.length">
                <Input
                  :id="field.name"
                  v-bind="componentField"
                  placeholder="URL de l'image"
                  type="url"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
                <div
                  v-if="field.value && !errors.length"
                  class="mt-4 aspect-video w-full overflow-hidden rounded-lg border"
                >
                  <img :src="field.value" alt="Aperçu" class="h-full w-full object-cover" />
                </div>
              </Field>
            </VeeField>
          </CardContent>
        </Card>
      </div>
    </div>
  </form>
</template>
<script setup lang="ts">
import { hasRoute, urlFor } from '@/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Link, router, usePage } from '@inertiajs/vue3'
import { Textarea } from '@/shared/components/ui/textarea'
import { MarkdownTextarea } from '@/shared/components/ui/markdown'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { editPostSchema } from '@/features/posts/schemas/dashboard/post.schema'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field'
import { DASHBOARD_POST_FORMS_ID } from '@/features/posts/constants/dashboard_posts.constants'
import { DateTimePicker } from '@/shared/components/ui/datetime-picker'
import type { Data } from '@generated/data'
import { watch } from 'vue'

type Props = {
  post: Data.Posts.Post.Variants['allFields']
}

const props = usePage<Props>().props

const form = useForm({
  validationSchema: toTypedSchema(editPostSchema),
  initialValues: {
    title: props.post.title || '',
    slug: props.post.slug || '',
    excerpt: props.post.excerpt || '',
    content: props.post.content || '',
    coverImageUrl: props.post.coverImageUrl || '',
    status: props.post.status || '',
    publishedAt: (props.post.publishedAt
      ? new Date(props.post.publishedAt)
      : undefined) as Date | null,
  },
})

const onSubmit = form.handleSubmit((values) => {
  if (!hasRoute('dashboard.dashboard_articles.update')) return

  router.put(urlFor('dashboard.dashboard_articles.update', { id: props.post.id }), values, {
    preserveScroll: true,
    preserveState: true,
    onError(err) {
      form.setErrors(err)
    },
  })
})

watch(
  () => form.values.status,
  (newStatus) => {
    if (newStatus === 'published') {
      form.setFieldValue(
        'publishedAt',
        props.post.publishedAt ? new Date(props.post.publishedAt) : new Date(Date.now())
      )
      return
    }

    form.setFieldValue('publishedAt', null)
  }
)
</script>
