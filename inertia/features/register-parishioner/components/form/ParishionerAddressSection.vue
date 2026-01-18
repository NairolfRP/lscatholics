<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <MapPin class="w-5 h-5" />
      Adresse
    </h3>

    <div class="grid md:grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="address" :validate-on-blur="!isFieldDirty">
        <FormItem>
          <div class="space-y-2 mb-7">
            <FormLabel>Adresse postale *</FormLabel>
            <FormControl>
              <Input v-bind="componentField" required placeholder="123 Main Street" />
            </FormControl>
            <FormDescription>
              (( Indiquez le nom exact de votre propriété pour que nous puissions vous envoyer des
              colis depuis le script La Poste. ))
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <FormField v-slot="{ value }" name="district">
        <FormItem>
          <div class="space-y-2">
            <FormLabel>District *</FormLabel>
            <Select :model-value="value" @update:model-value="handleDistrictChange" required>
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
          </div>
        </FormItem>
      </FormField>
    </div>
  </div>
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { MapPin } from 'lucide-vue-next'
import { Input } from '@/shared/components/ui/input'
import { useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'
import type { AcceptableValue } from 'reka-ui'
import { computed } from 'vue'

const { isFieldDirty, setFieldValue } = useFormContext<RegisterParishionerFormValues>()

const handleDistrictChange = (v: AcceptableValue) => {
  setFieldValue('district', (v as GTA5DistrictId) ?? undefined)
}

const sortedLSDistricts = computed(() =>
  getLSDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

const sortedNorthDistricts = computed(() =>
  getNorthDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)
</script>
