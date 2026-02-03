<template>
  <VeeFieldArray v-slot="{ fields }" name="responsibilities">
    <FieldSet class="gap-4">
      <FieldLegend variant="label">Fonctions essentielles *</FieldLegend>

      <FieldGroup class="gap-4">
        <VeeField
          v-for="(field, index) in fields"
          :key="field.key"
          v-slot="{ field: fieldProps, errors: fieldErrors }"
          :name="`responsibilities[${index}]`"
        >
          <Field orientation="horizontal" :data-invalid="!!fieldErrors.length">
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  :id="`form-responsibilities-${index}`"
                  :model-value="fieldProps.value"
                  @update:model-value="fieldProps.onChange"
                  @blur="fieldProps.onBlur"
                  :aria-invalid="!!fieldErrors.length"
                  placeholder="Rédiger des offres d'emplois"
                  type="text"
                  autocomplete="off"
                />
                <InputGroupAddon v-if="fields.length > 1" align="inline-end">
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    :aria-label="`Supprimer la ligne ${index + 1}`"
                    @click="removeLine(index)"
                  >
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
            </FieldContent>
          </Field>
        </VeeField>
        <Button type="button" variant="outline" size="sm" @click="addNewLine"> Ajouter </Button>
      </FieldGroup>
      <FieldError v-if="errors.responsibilities" :errors="[errors.responsibilities]" />
    </FieldSet>
  </VeeFieldArray>
</template>

<script setup lang="ts">
import {
  Field as VeeField,
  FieldArray as VeeFieldArray,
  useFieldArray,
  useFormContext,
} from 'vee-validate'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/shared/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { X } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'

const { errors } = useFormContext()

const { push, remove } = useFieldArray<string>('responsibilities')

function removeLine(index: number) {
  remove(index)
}

function addNewLine() {
  push('')
}
</script>
