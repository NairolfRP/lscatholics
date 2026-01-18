<template>
  <FormField v-slot="{ value, setValue }" name="age">
    <FormItem>
      <NumberField
        id="age"
        :min="0"
        :model-value="value"
        @update:model-value="
          (v) => {
            if (v) {
              setValue(v)
            } else {
              setValue(undefined)
            }
          }
        "
      >
        <FormLabel>Âge</FormLabel>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <FormControl>
            <NumberFieldInput />
          </FormControl>
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
</script>
