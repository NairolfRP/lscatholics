<template>
  <VeeField v-slot="{ field, errors, setValue }" name="ethnicity" class="space-y-1.5">
    <Field :data-invalid="!!errors.length">
      <FieldContent>
        <FieldLabel :for="field.name">Ethnie</FieldLabel>
      </FieldContent>
      <Select
        :model-value="field.value"
        @update:model-value="
          (v) => {
            if (v !== 'null') {
              setValue(v as EthnicGroupId)
            } else {
              setValue(undefined)
            }
          }
        "
        @blur="field.onBlur"
      >
        <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
          <SelectValue placeholder="Sélectionnez une ethnie" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="null" :disabled="!field.value"> N/A </SelectItem>
            <SelectSeparator />
            <SelectItem v-for="ethnicGroup of ETHNIC_GROUPS" :value="ethnicGroup.id">
              {{ ethnicGroup.label }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import { ETHNIC_GROUPS, EthnicGroupId } from '#shared/constants/ethnicity.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
