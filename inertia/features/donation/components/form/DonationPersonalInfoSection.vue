<template>
  <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField
      v-for="field of [
        { id: 'firstname', label: 'Prénom', placeholder: 'John' },
        { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
      ]"
      v-slot="{ componentField }"
      :name="field.id"
    >
      <FormItem>
        <FormLabel>{{ field.label }} *</FormLabel>
        <FormControl>
          <Input type="text" :placeholder="field.placeholder" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </div>

  <DonationOrganizationField />

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <DonationAgeField />
    <DonationEthnicityField />
  </div>

  <DonationPhoneField />
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import DonationOrganizationField from '@/features/donation/components/form/DonationOrganizationField.vue'
import DonationAgeField from '@/features/donation/components/form/DonationAgeField.vue'
import DonationEthnicityField from '@/features/donation/components/form/DonationEthnicityField.vue'
import DonationPhoneField from '@/features/donation/components/form/DonationPhoneField.vue'
</script>
