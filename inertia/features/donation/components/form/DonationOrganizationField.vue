<template>
  <div class="flex flex-col space-y-4">
    <FormField v-slot="{ value, handleChange }" type="checkbox" name="isOrganization">
      <FormItem>
        <div class="flex items-center space-x-2">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <FormLabel class="text-sm">
            Je fais un don au nom d'une organisation ou d'une société
          </FormLabel>
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="organizationName">
      <FormItem>
        <div v-if="values.isOrganization" class="space-y-3 pl-6 border-l-2 border-gray-200">
          <FormLabel>Nom de l'organisation *</FormLabel>
          <FormControl>
            <Input type="text" placeholder="Doe Corporation" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
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
import { Checkbox } from '@/shared/components/ui/checkbox'
import { useFormValues } from 'vee-validate'
import type { DonationFormValues } from '@/features/donation/types/donation.types'

const values = useFormValues<DonationFormValues>()
</script>
