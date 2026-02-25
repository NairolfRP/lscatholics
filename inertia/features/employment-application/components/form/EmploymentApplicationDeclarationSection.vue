<template>
  <FieldGroup>
    <VeeField v-slot="{ field, errors, value, setValue }" name="applicantDeclaration">
      <FieldSet :data-invalid="!!errors.length">
        <FieldGroup data-slot="checkbox-group">
          <Field
            v-for="statement in APPLICANT_STATEMENTS"
            :key="statement.id"
            orientation="horizontal"
            :data-invalid="!!errors.length"
          >
            <Checkbox
              :id="statement.id"
              :name="field.name"
              :aria-invalid="!!errors.length"
              :model-value="field.value?.includes(statement.id)"
              @update:model-value="
                (checked: boolean | 'indeterminate') => {
                  if (!checked) {
                    return setValue([...(value || []).filter((v: string) => v !== statement.id)])
                  }
                  setValue([...(value || []), statement.id])
                }
              "
            />
            <FieldLabel :for="statement.id" class="font-normal">
              {{ statement.label }}
            </FieldLabel>
          </Field>
        </FieldGroup>
        <FieldError v-if="errors.length" :errors="errors" />
      </FieldSet>
    </VeeField>
  </FieldGroup>
</template>

<script setup lang="ts">
import { Field as VeeField } from 'vee-validate'
import { APPLICANT_STATEMENTS } from '#shared/constants/employment.constants'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/shared/components/ui/field'
import { Checkbox } from '@/shared/components/ui/checkbox'
</script>
