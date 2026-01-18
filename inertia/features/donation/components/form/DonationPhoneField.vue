<template>
  <FormField v-slot="{ componentField }" name="phone">
    <FormItem>
      <FormLabel>Numéro de téléphone</FormLabel>
      <FormControl>
        <Input type="tel" v-bind="componentField" />
      </FormControl>
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
import { Input } from '@/shared/components/ui/input'
</script>
