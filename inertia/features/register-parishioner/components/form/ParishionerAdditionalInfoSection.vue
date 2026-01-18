<template>
  <FormField v-slot="{ componentField }" name="message">
    <FormItem>
      <div class="space-y-4">
        <FormLabel class="text-lg font-semibold text-gray-900">
          Informations complémentaires
        </FormLabel>
        <div class="space-y-2">
          <FormControl>
            <Textarea v-bind="componentField" placeholder="Écrire ici..." :rows="4" :max="300" />
          </FormControl>
          <FormDescription>
            Facultatif. Vous pouvez ajouter tout ce que vous avez envie de nous transmettre : à
            propos de vous, de votre foyer, de vos besoins, ...
          </FormDescription>
          <FormMessage />
        </div>
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Textarea } from '@/shared/components/ui/textarea'
</script>
