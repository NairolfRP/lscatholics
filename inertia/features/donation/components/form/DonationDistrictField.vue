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
          <SelectGroup>
            <SelectLabel>Los Santos</SelectLabel>
            <SelectItem
              v-for="lsDistrict of sortedLSDistricts"
              :key="lsDistrict.id"
              :value="lsDistrict.id"
            >
              {{ lsDistrict.label }}
            </SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Autre ville/district</SelectLabel>
            <SelectItem
              v-for="northDistrict of sortedNorthDistricts"
              :key="northDistrict.id"
              :value="northDistrict.id"
            >
              {{ northDistrict.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import {
  getLSDistricts,
  getNorthDistricts,
  GTA5DistrictId,
} from '#shared/constants/districts.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Field as VeeField, useFormValues, useSetFieldValue } from 'vee-validate'
import { computed } from 'vue'
import { DonationFormValues } from '@/features/donation/types/donation.types'
import { AcceptableValue } from 'reka-ui'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'

const values = useFormValues<DonationFormValues>()
const setFieldValue = useSetFieldValue<DonationFormValues['district']>('district')

const sortedLSDistricts = computed(() =>
  getLSDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

const sortedNorthDistricts = computed(() =>
  getNorthDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

const handleDistrictChange = (v: AcceptableValue) => {
  const newValue = v && v !== 'none' ? (v as GTA5DistrictId) : undefined

  setFieldValue(newValue)
}
</script>
