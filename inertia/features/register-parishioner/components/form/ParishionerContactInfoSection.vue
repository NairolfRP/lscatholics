<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <PhoneCall class="size-5" />
      Informations de contact
    </h3>

    <div class="grid md:grid-cols-2 gap-4">
      <template v-for="item of items" :key="item.id">
        <VeeField v-slot="{ field, errors }" :name="item.id" :validate-on-blur="!isFieldDirty">
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldLabel :for="item.id" class="flex items-center gap-2">
                {{ item.label }} <template v-if="item.required">*</template>
              </FieldLabel>
              <Input
                :id="item.id"
                v-bind="field"
                type="tel"
                :required="!!item.required"
                placeholder="1234567"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhoneCall } from 'lucide-vue-next'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField, useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'

const { isFieldDirty } = useFormContext<RegisterParishionerFormValues>()

const items = [
  {
    id: 'phone',
    label: 'Numéro de téléphone',
    required: true,
  },
  {
    id: 'emergencyPhone',
    label: "N° de téléphone à appeler en cas d'urgence",
  },
]
</script>
