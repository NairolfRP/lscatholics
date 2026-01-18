<template>
  <FormField v-slot="{ value }" name="district">
    <FormItem>
      <FormLabel>District {{ values.address ? '*' : '' }}</FormLabel>
      <Select :model-value="value" @update:model-value="handleDistrictChange">
        <FormControl>
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sélectionnez un district" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="null" :disabled="!value"> N/A </SelectItem>
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
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  getLSDistricts,
  getNorthDistricts,
  GTA5DistrictId,
} from '#shared/constants/districts.constants'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
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
import { useFormValues, useSetFieldValue } from 'vee-validate'
import { computed } from 'vue'
import { DonationFormValues } from '@/features/donation/types/donation.types'
import { AcceptableValue } from 'reka-ui'

const values = useFormValues<DonationFormValues>()
const setFieldValue = useSetFieldValue<DonationFormValues['district']>('district')

const sortedLSDistricts = computed(() =>
  getLSDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

const sortedNorthDistricts = computed(() =>
  getNorthDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

const handleDistrictChange = (v: AcceptableValue) => {
  setFieldValue((v as GTA5DistrictId) ?? undefined)
}
</script>
