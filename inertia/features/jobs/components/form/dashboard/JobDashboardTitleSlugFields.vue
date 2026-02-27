<template>
  <VeeField v-slot="{ field, errors }" name="title">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :for="field.name">Titre *</FieldLabel>
      <Input
        :id="field.name"
        :model-value="field.value"
        @update:model-value="field.onChange"
        @blur="
          (e: Event) => {
            generateSlug()
            field.onBlur(e)
          }
        "
        placeholder="Titre de l'emploi"
        required
        :aria-invalid="!!errors.length"
      />
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>

  <VeeField v-slot="{ field, errors }" name="slug">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :for="field.name">Slug</FieldLabel>
      <Input
        :id="field.name"
        :model-value="field.value"
        @update:model-value="field.onChange"
        @blur="field.onBlur"
        placeholder="url-de-loffre"
        :aria-invalid="!!errors.length"
      />
      <FieldDescription>Laissez vide pour générer automatiquement</FieldDescription>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>
<script setup lang="ts">
import { Field as VeeField, useFormContext } from 'vee-validate'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { CreateJobOfferData } from '@/features/jobs/schemas/dashboard/create_job_offer.schema'

const form = useFormContext<CreateJobOfferData>()

const props = defineProps<{
  autoSlug?: boolean
}>()

const generateSlug = () => {
  if (!props.autoSlug || form.values.slug || !form.values.title) return
  const slug = form.values.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  form.setFieldValue('slug', slug)
}
</script>
