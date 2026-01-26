<template>
  <DonationFieldsGrid>
    <VeeField v-slot="{ field, errors }" name="address">
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Adresse</FieldLabel>
        <Input
          :id="field.name"
          type="text"
          v-bind="field"
          placeholder="123 San Andreas Avenue"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <DonationDistrictField />
  </DonationFieldsGrid>
</template>

<script setup lang="ts">
import { Input } from '@/shared/components/ui/input'
import DonationDistrictField from '@/features/donation/components/form/DonationDistrictField.vue'
import DonationFieldsGrid from '@/features/donation/components/form/DonationFieldsGrid.vue'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
