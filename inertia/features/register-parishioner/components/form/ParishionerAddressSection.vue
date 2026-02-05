<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <MapPin class="w-5 h-5" />
      Adresse
    </h3>

    <div class="grid md:grid-cols-2 gap-4">
      <VeeField v-slot="{ field, errors }" name="address" :validate-on-blur="!isFieldDirty">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2 mb-7">
            <FieldLabel :for="field.name">Adresse postale *</FieldLabel>

            <Input
              :id="field.name"
              v-bind="field"
              required
              placeholder="123 Main Street"
              :aria-invalid="!!errors.length"
            />
            <FieldError v-if="errors.length" :errors="errors" />
            <FieldDescription>
              (( Indiquez le nom exact de votre propriété pour que nous puissions vous envoyer des
              colis depuis le script La Poste. ))
            </FieldDescription>
          </div>
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="district">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldContent>
              <FieldLabel :for="field.name">District *</FieldLabel>
            </FieldContent>
            <Select
              :model-value="field.value"
              @update:model-value="handleDistrictChange"
              @blur="field.onBlur"
              required
            >
              <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Sélectionnez un district" />
              </SelectTrigger>
              <SelectContent>
                <!-- <SelectGroup>
                  <SelectItem value="null" :disabled="!field.value"> N/A </SelectItem>
                </SelectGroup> --->
                <SelectSeparator />
                <DistrictSelectGroups />
              </SelectContent>
            </Select>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GTA5DistrictId } from '#shared/constants/districts.constants'
import {
  Select,
  SelectContent,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { MapPin } from 'lucide-vue-next'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField, useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'
import type { AcceptableValue } from 'reka-ui'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field'
import { DistrictSelectGroups } from '@/shared/components/forms/district-select'

const { isFieldDirty, setFieldValue } = useFormContext<RegisterParishionerFormValues>()

const handleDistrictChange = (v: AcceptableValue) => {
  setFieldValue('district', (v as GTA5DistrictId) ?? undefined)
}
</script>
