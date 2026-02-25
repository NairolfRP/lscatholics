<template>
  <FieldGroup>
    <VeeField v-slot="{ field, errors }" name="discordUsername">
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Nom d'utilisateur Discord *</FieldLabel>
        <FieldDescription>
          Nous utilisons principalement Discord pour la communication OOC et l'intranet IC. Cette
          information nous permettra de t'ajouter les accès internes si ton personnage est embauché.
        </FieldDescription>
        <Input :id="field.name" v-bind="field" :aria-invalid="!!errors.length" />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="motivationsOOC">
      <Field :data-invalid="!!errors.length">
        <FieldContent>
          <FieldLabel :for="field.name">Motivations et ambitions</FieldLabel>
          <FieldDescription>
            Tu peux de manière facultative décrire tes motivations et ambitions OOC ! C'est une
            façon comme une autre de nous fournir, aussi, des idées et nous montrer ce que tu
            souhaites développer avec nous.
          </FieldDescription>
        </FieldContent>
        <Textarea
          :id="field.name"
          v-bind="field"
          :maxlength="1500"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>
</template>

<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
</script>
