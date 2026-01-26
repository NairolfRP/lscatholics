<template>
  <VeeField v-slot="{ field, errors }" name="phone">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :for="field.name">Numéro de téléphone</FieldLabel>
      <Input
        :id="field.name"
        v-bind="field"
        type="tel"
        placeholder="1234"
        :aria-invalid="!!errors.length"
      />
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
