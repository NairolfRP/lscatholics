<template>
  <VeeField v-slot="{ field, errors }" name="department">
    <Field orientation="responsive" :data-invalid="!!errors.length">
      <FieldContent>
        <FieldLabel :for="field.name">Département *</FieldLabel>
        <FieldError v-if="errors.length" :errors="errors" />
      </FieldContent>
      <Select :model-value="field.value" @update:model-value="field.onChange" @blur="field.onBlur">
        <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
          <SelectValue placeholder="Sélectionner un département" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem
            v-for="department in DEPARTMENTS.sort((a, b) => {
              const textA = a.title.toUpperCase()
              const textB = b.title.toUpperCase()
              return textA < textB ? -1 : textA > textB ? 1 : 0
            })"
            :key="department.id"
            :value="department.id"
          >
            {{ department.title }}
          </SelectItem>
        </SelectContent>
      </Select>
    </Field>
  </VeeField>

  <VeeField v-slot="{ field, errors }" name="reportsTo">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :for="field.name">Relève de *</FieldLabel>
      <Input
        :id="field.name"
        :model-value="field.value"
        @update:model-value="field.onChange"
        @blur="field.onBlur"
        placeholder="Directeur des Ressources Humaines"
        :aria-invalid="!!errors.length"
      />
      <FieldDescription>Nom de la fonction du responsable direct</FieldDescription>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import { DEPARTMENTS } from '@/shared/constants/departments.constants'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
</script>
