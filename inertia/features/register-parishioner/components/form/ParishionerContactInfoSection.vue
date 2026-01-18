<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <PhoneCall class="size-5" />
      Informations de contact
    </h3>

    <div class="grid md:grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="space-y-2">
            <FormLabel class="flex items-center gap-2"> Numéro de téléphone *</FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="tel" required placeholder="1234567" />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <FormField
        v-slot="{ componentField }"
        name="emergencyPhone"
        :validate-on-blur="!isFieldDirty"
      >
        <FormItem>
          <div class="space-y-2">
            <FormLabel class="flex items-center gap-2">
              N° de téléphone à appeler en cas d'urgence
            </FormLabel>
            <FormControl>
              <Input v-bind="componentField" type="tel" placeholder="1234567" />
            </FormControl>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>
    </div>
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
import { PhoneCall } from 'lucide-vue-next'
import { Input } from '@/shared/components/ui/input'
import { useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

const { isFieldDirty } = useFormContext<RegisterParishionerFormValues>()
</script>
