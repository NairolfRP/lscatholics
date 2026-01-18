<template>
  <!-- Anonymous Option -->
  <FormField v-slot="{ value, handleChange }" type="checkbox" name="anonymous">
    <FormItem class="flex flex-row items-center gap-x-2">
      <FormControl>
        <Checkbox :model-value="value" @update:model-value="handleChange" />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel class="text-sm">
          Je souhaite que ma donation reste privée, ce qui veut dire qu'elle ne sera ni affichée ni
          communiquée publiquement.
        </FormLabel>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>

  <FormField v-slot="{ value, handleChange }" type="checkbox" name="fleecaConfirmation">
    <FormItem class="flex flex-row items-center gap-x-2">
      <FormControl>
        <Checkbox :model-value="value" @update:model-value="handleChange" />
      </FormControl>
      <div class="space-y-1 leading-none">
        <FormLabel class="inline text-sm">
          (( Je confirme que je suis BIEN CONNECTÉ sur l'<LinkText
            href="https://fleeca.gta.world"
            target="_blank"
            external
            >application web Fleeca</LinkText
          >
          de GTA World. Dans le cas contraire, la redirection vers le paiement échouera et tout
          devra être recommencé.))
        </FormLabel>
        <FormMessage />
      </div>
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
import { LinkText } from '@/shared/components/ui/LinkText'
import { Checkbox } from '@/shared/components/ui/checkbox'
</script>
