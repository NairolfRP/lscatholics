<template>
  <VeeField v-slot="{ field, errors }" name="postedAt">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :id="field.name">Date de publication</FieldLabel>
      <DateTimePicker
        :id="field.name"
        :model-value="field.value"
        @update:model-value="field.onChange"
        @blur="field.onBlur"
      />
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>

  <VeeField v-slot="{ field, errors, setValue }" name="expiresAt">
    <Field :data-invalid="!!errors.length">
      <FieldLabel :id="field.name">Date de fermeture</FieldLabel>
      <DateTimePicker
        :id="field.name"
        :model-value="field.value"
        @update:model-value="
          (v) => {
            if (!v) {
              return setValue(undefined)
            }
            setValue(v)
          }
        "
        @blur="field.onBlur"
      />
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>
<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { DateTimePicker } from '@/shared/components/ui/datetime-picker'
</script>
