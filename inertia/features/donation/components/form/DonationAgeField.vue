<template>
  <VeeField v-slot="{ field, errors, setValue }" name="age">
    <Field :data-invalid="!!errors.length">
      <NumberField
        id="age"
        :min="0"
        :model-value="field.value"
        @update:model-value="
          (v) => {
            if (v) {
              setValue(v)
            } else {
              setValue(undefined)
            }
          }
        "
      >
        <FieldLabel :for="field.name">Âge</FieldLabel>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput :aria-invalid="!!errors.length" />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
