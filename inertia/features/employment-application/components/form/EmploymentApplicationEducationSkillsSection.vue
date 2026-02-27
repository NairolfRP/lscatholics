<template>
  <FieldGroup
    :class="
      cn('grid grid-cols-1 md:grid-cols-2 gap-4 items-start', {
        'md:grid-cols-1': schoolLevelsWithoutFieldOfStudy.includes(
          values.education?.highestLevel || NONE_SCHOOL_LEVEL
        ),
      })
    "
  >
    <VeeField v-slot="{ field, errors }" name="education.highestLevel">
      <Field :data-invalid="!!errors.length">
        <FieldContent>
          <FieldLabel :for="field.name">
            Quel est votre plus haut niveau d'éducation ? *
          </FieldLabel>
        </FieldContent>
        <Select
          :model-value="field.value"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        >
          <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem v-for="item in SCHOOL_LEVELS" :key="item.id" :value="item.id">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField
      v-if="
        !schoolLevelsWithoutFieldOfStudy.includes(
          values.education?.highestLevel || NONE_SCHOOL_LEVEL
        )
      "
      v-slot="{ field, errors }"
      name="education.fieldOfStudy"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Domaine d'études *</FieldLabel>
        <Input
          :id="field.name"
          v-bind="field"
          :aria-invalid="!!errors.length"
          placeholder="Administration des affaires"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup>
    <VeeField v-slot="{ field, errors }" name="spokenLanguages">
      <Field :data-invalid="!!errors.length">
        <FieldContent>
          <FieldLabel :for="field.name"> Langues étrangères maîtrisées </FieldLabel>
        </FieldContent>
        <Select
          :model-value="field.value"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
          multiple
        >
          <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
            <SelectValue placeholder="Sélectionner une ou plusieurs langues" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem v-for="item in SPOKEN_LANGUAGES" :key="item.id" :value="item.id">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />
</template>

<script setup lang="ts">
import { Field as VeeField, useFormContext } from 'vee-validate'
import { cn } from '@/lib/utils'
import { SCHOOL_LEVELS, SPOKEN_LANGUAGES } from '#shared/constants/person.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { EmploymentApplicationFormValues } from '@/features/employment-application/types/employment_application_form.types'
import {
  NONE_SCHOOL_LEVEL,
  schoolLevelsWithoutFieldOfStudy,
} from '@/features/employment-application/constants/employment_application_form.constants'

const { values } = useFormContext<EmploymentApplicationFormValues>()
</script>
