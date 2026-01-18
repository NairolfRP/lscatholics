<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <FormField v-slot="{ componentField }" name="address">
      <FormItem>
        <FormLabel>Adresse</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <DonationDistrictField />
  </div>
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
import DonationDistrictField from '@/features/donation/components/form/DonationDistrictField.vue'
</script>
