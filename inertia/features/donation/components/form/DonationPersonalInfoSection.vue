<template>
  <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>

  <DonationFieldsGrid>
    <VeeField
      v-for="item of [
        { id: 'firstname', label: 'Prénom', placeholder: 'John' },
        { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
      ]"
      v-slot="{ componentField, errors }"
      :name="item.id"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="item.id">{{ item.label }} *</FieldLabel>
        <Input
          :id="item.id"
          v-bind="componentField"
          type="text"
          :placeholder="item.placeholder"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </DonationFieldsGrid>

  <DonationOrganizationField />

  <DonationFieldsGrid>
    <DonationAgeField />
    <DonationEthnicityField />
  </DonationFieldsGrid>

  <DonationPhoneField />
</template>

<script setup lang="ts">
import { Input } from '@/shared/components/ui/input'
import DonationOrganizationField from '@/features/donation/components/form/DonationOrganizationField.vue'
import DonationAgeField from '@/features/donation/components/form/DonationAgeField.vue'
import DonationEthnicityField from '@/features/donation/components/form/DonationEthnicityField.vue'
import DonationPhoneField from '@/features/donation/components/form/DonationPhoneField.vue'
import DonationFieldsGrid from '@/features/donation/components/form/DonationFieldsGrid.vue'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
