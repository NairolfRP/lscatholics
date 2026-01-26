<template>
  <!-- Anonymous Option -->
  <VeeField v-slot="{ field, errors }" type="checkbox" name="anonymous">
    <Field orientation="horizontal" :data-invalid="!!errors.length">
      <Checkbox
        :model-value="field.value"
        :aria-invalid="!!errors.length"
        @update:model-value="field.onChange"
      />
      <FieldLabel :for="field.name" class="text-sm">
        Je souhaite que ma donation reste privée, ce qui veut dire qu'elle ne sera ni affichée ni
        communiquée publiquement.
      </FieldLabel>
      <FieldError v-if="errors.length" :errors="errors" />
    </Field>
  </VeeField>

  <VeeField v-slot="{ field, errors }" type="checkbox" name="fleecaConfirmation">
    <Field orientation="horizontal" :data-invalid="!!errors.length">
      <Checkbox :id="field.name" :model-value="field.value" @update:model-value="field.onChange" />
      <FieldLabel :for="field.name" class="inline text-sm">
        (( Je confirme que je suis BIEN CONNECTÉ sur l'<LinkText
          href="https://fleeca.gta.world"
          target="_blank"
          external
          >application web Fleeca</LinkText
        >
        de GTA World. Dans le cas contraire, la redirection vers le paiement échouera et tout devra
        être recommencé.))
      </FieldLabel>
    </Field>

    <FieldError v-if="errors.length" :errors="errors" />
  </VeeField>
</template>

<script setup lang="ts">
import { LinkText } from '@/shared/components/ui/LinkText'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
