<template>
  <VeeField v-slot="{ field, errors }" name="message">
    <Field :data-invalid="!!errors.length">
      <div class="space-y-4">
        <FieldLabel :for="field.name" class="text-lg font-semibold text-gray-900">
          Informations complémentaires
        </FieldLabel>
        <div class="space-y-2">
          <Textarea
            :id="field.name"
            v-bind="field"
            placeholder="Écrire ici..."
            :rows="4"
            :max="300"
            :aria-invalid="!!errors.length"
          />
          <FieldDescription>
            Facultatif. Vous pouvez ajouter tout ce que vous avez envie de nous transmettre : à
            propos de vous, de votre foyer, de vos besoins, ...
          </FieldDescription>
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </div>
    </Field>
  </VeeField>
</template>

<script setup lang="ts">
import { Textarea } from '@/shared/components/ui/textarea'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
</script>
