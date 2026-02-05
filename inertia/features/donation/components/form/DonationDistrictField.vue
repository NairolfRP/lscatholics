<template>
  <VeeField v-slot="{ field, errors }" name="district">
    <Field :data-invalid="!!errors.length">
      <FieldContent>
        <FieldLabel :for="field.name">District {{ values.address ? '*' : '' }}</FieldLabel>
      </FieldContent>
      <Select
        :model-value="field.value"
        @update:model-value="handleDistrictChange"
        @blur="field.onBlur"
      >
        <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
          <SelectValue placeholder="Sélectionnez un district" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectGroup>
            <SelectItem value="none" :disabled="!field.value"> N/A </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <DistrictSelectGroups />
        </SelectContent>
      </Select>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import { GTA5DistrictId } from '#shared/constants/districts.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Field as VeeField, useFormValues, useSetFieldValue } from 'vee-validate'
import { DonationFormValues } from '@/features/donation/types/donation.types'
import { AcceptableValue } from 'reka-ui'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { DistrictSelectGroups } from '@/shared/components/forms/district-select'

const values = useFormValues<DonationFormValues>()
const setFieldValue = useSetFieldValue<DonationFormValues['district']>('district')

const handleDistrictChange = (v: AcceptableValue) => {
  const newValue = v && v !== 'none' ? (v as GTA5DistrictId) : undefined

  setFieldValue(newValue)
}
</script>
