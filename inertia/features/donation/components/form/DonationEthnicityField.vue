<template>
  <FormField v-slot="{ value, setValue }" name="ethnicity" class="space-y-1.5">
    <FormItem>
      <FormLabel>Ethnie</FormLabel>
      <Select
        :model-value="value"
        @update:model-value="
          (v) => {
            if (v !== 'null') {
              setValue(v as EthnicGroupId)
            } else {
              setValue(undefined)
            }
          }
        "
      >
        <FormControl>
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Sélectionnez une ethnie" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="null" :disabled="!value"> N/A </SelectItem>
            <SelectSeparator />
            <SelectItem v-for="ethnicGroup of ETHNIC_GROUPS" :value="ethnicGroup.id">
              {{ ethnicGroup.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { ETHNIC_GROUPS, EthnicGroupId } from '#shared/constants/ethnicity.constants'
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
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
</script>
