<template>
  <VeeFieldArray v-slot="{ fields }" name="requirements" class="space-y-2">
    <FieldSet class="gap-4">
      <FieldLegend variant="label">Conditions requises</FieldLegend>
      <FieldGroup class="gap-4">
        <VeeField
          v-for="(field, index) in fields"
          :key="field.key"
          v-slot="{ field: fieldProps, errors: fieldErrors }"
          :name="`requirements[${index}]`"
        >
          <Field orientation="horizontal" :data-invalid="!!fieldErrors.length">
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  :id="`requirements-array-${index}`"
                  :model-value="fieldProps.value"
                  @update:model-value="fieldProps.onChange"
                  @blur="fieldProps.onBlur"
                  :aria-invalid="!!fieldErrors.length"
                  placeholder="Être titulaire du permis de conduire"
                  type="text"
                  autocomplete="off"
                />

                <InputGroupAddon align="inline-end">
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
      <FieldError v-if="errors.requirements" :errors="[errors.requirements]" />
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

const { push, remove } = useFieldArray<string>('requirements')

function removeLine(index: number) {
  remove(index)
}

function addNewLine() {
  push('')
}
</script>
