<template>
  <div class="flex flex-col space-y-4">
    <VeeField v-slot="{ field, errors }" type="checkbox" name="isOrganization">
      <Field :data-invalid="!!errors.length">
        <div class="flex items-center space-x-2">
          <Checkbox
            :id="field.name"
            :name="field.name"
            :model-value="field.value"
            @update:model-value="field.onChange"
          />
          <FieldLabel :for="field.name" class="text-sm">
            Je fais un don au nom d'une organisation ou d'une société
          </FieldLabel>
        </div>
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="organizationName">
      <Field :data-invalid="!!errors.length">
        <div v-show="values.isOrganization" class="space-y-3 pl-6 border-l-2 border-gray-200">
          <FieldLabel :for="field.name">Nom de l'organisation *</FieldLabel>
          <Input
            :id="field.name"
            v-bind="field"
            type="text"
            placeholder="Doe Corporation"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </Field>
    </VeeField>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field as VeeField, useFormValues } from 'vee-validate'
import type { DonationFormValues } from '@/features/donation/types/donation.types'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'

const values = useFormValues<DonationFormValues>()
</script>
