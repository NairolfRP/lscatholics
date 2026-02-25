<template>
  <FieldGroup class="grid sm:grid-cols-2 md:grid-cols-3 items-start">
    <VeeField
      v-for="item in [
        { id: 'firstname', label: 'Prénom', placeholder: 'John', required: true },
        { id: 'middleName', label: 'Deuxième prénom', placeholder: 'Michael' },
        { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe', required: true },
      ]"
      :key="item.id"
      v-slot="{ field, componentField, errors }"
      :name="item.id"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="item.id">
          {{ item.label }} <template v-if="item.required">*</template>
        </FieldLabel>
        <Input
          :id="field.name"
          type="text"
          v-bind="componentField"
          :placeholder="item.placeholder"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup>
    <VeeField v-slot="{ field, value, errors }" name="age">
      <Field :data-invalid="!!errors.length" class="max-w-md">
        <FieldLabel :for="field.name">Âge *</FieldLabel>
        <NumberField
          id="age"
          :min="16"
          :max="115"
          :model-value="value"
          @update:model-value="field.onChange"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="gender">
      <FieldSet>
        <FieldLegend variant="label">
          Je suis un{{ field.value === 'female' ? 'e' : '' }} *
        </FieldLegend>
        <RadioGroup :model-value="field.value" @update:model-value="field.onChange">
          <FieldLabel v-for="item in GENDERS" :key="item.id" :for="`${field.name}-${item.id}`">
            <Field orientation="horizontal" :data-invalid="!!errors.length">
              <FieldContent>
                <FieldTitle>{{ item.label }}</FieldTitle>
              </FieldContent>
              <RadioGroupItem
                :id="`${field.name}-${item.id}`"
                :value="item.id"
                :aria-invalid="!!errors.length"
              />
            </Field>
          </FieldLabel>
        </RadioGroup>
        <FieldError v-if="errors.length" :errors="errors" />
      </FieldSet>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup class="grid sm:grid-cols-2 items-start">
    <VeeField v-slot="{ field, errors }" name="address">
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Adresse *</FieldLabel>

        <Input
          :id="field.name"
          type="text"
          v-bind="field"
          placeholder="123 San Andreas Avenue"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="district">
      <Field :data-invalid="!!errors.length">
        <FieldContent>
          <FieldLabel :for="field.name">District *</FieldLabel>
        </FieldContent>
        <Select
          :model-value="field.value"
          @update:model-value="field.onChange"
          @blur="field.onBlur"
        >
          <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
            <SelectValue placeholder="Sélectionnez un district" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <DistrictSelectGroups />
          </SelectContent>
        </Select>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup>
    <VeeField v-slot="{ field, errors }" name="phone">
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Numéro de téléphone *</FieldLabel>

        <Input
          :id="field.name"
          type="tel"
          v-bind="field"
          placeholder="12345678"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup>
    <VeeField
      v-for="(item, index) in [
        {
          id: 'isPracticingCatholic',
          label: 'Êtes-vous catholique pratiquant ?',
          description: `La réponse a cette question n'est pas éliminatoire. L'archidiocèse peut
              préférer des candidats catholiques pour certains postes.`,
        },
        {
          id: 'isLegalUSWorker',
          label: `Si vous êtes embauché, pourrez-vous prouver votre droit à travailler aux États-Unis ?`,
          description: `Conformément aux lois fédérales sur l'immigration, les citoyens américains peuvent prouver leur droit à travailler aux U.S avec leur carte d'identité fédérale. Les étrangers doivent présenter une carte de résident permanent (green card) ou un permis de travail délivré par le Département de la Sécurité Interieure des États-Unis.`,
        },
        {
          id: 'hasDriverLicense',
          label: 'Possédez-vous un permis de conduire valide ?',
        },
      ]"
      :key="item.id"
      v-slot="{ field, errors }"
      :name="item.id"
    >
      <FieldSet>
        <FieldLegend variant="label">{{ item.label }} *</FieldLegend>
        <FieldDescription v-if="item.description">
          {{ item.description }}
        </FieldDescription>
        <RadioGroup :model-value="field.value" @update:model-value="field.onChange">
          <FieldLabel v-for="item in yesNo" :key="item.id" :for="`${field.name}-${item.id}`">
            <Field orientation="horizontal" :data-invalid="!!errors.length">
              <FieldContent>
                <FieldTitle>{{ item.label }}</FieldTitle>
              </FieldContent>
              <RadioGroupItem
                :id="`${field.name}-${item.id}`"
                :value="item.id"
                :aria-invalid="!!errors.length"
              />
            </Field>
          </FieldLabel>
        </RadioGroup>
        <FieldError v-if="errors.length" :errors="errors" />
        <FieldSeparator v-if="index === 0" />
      </FieldSet>
    </VeeField>
  </FieldGroup>

  <FieldSeparator class="my-1" />

  <FieldGroup>
    <VeeField v-slot="{ field, errors, setValue }" name="applicationSource.type">
      <Field :data-invalid="!!errors.length">
        <FieldContent>
          <FieldLabel :for="field.name">
            Comment avez-vous entendu parler de cette offre d'emploi ?
          </FieldLabel>
        </FieldContent>
        <Select
          :model-value="field.value"
          @update:model-value="(v) => setValue(v === 'none' ? undefined : v)"
          @blur="field.onBlur"
        >
          <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
            <SelectValue placeholder="Sélectionnez une réponse" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="none" :disabled="!field.value">N/A</SelectItem>
            <SelectItem v-for="item in APPLICATION_SOURCES" :key="item.id" :value="item.id">
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <VeeField
      v-slot="{ field, errors }"
      name="applicationSource.employeeReferral"
      v-if="values.applicationSource?.type === 'employeeReferral'"
    >
      <Field :data-invalid="!!errors.length">
        <FieldLabel :for="field.name">Indiquez l'identité de l'employé</FieldLabel>
        <Input
          :id="field.name"
          v-bind="field"
          placeholder="Jane Doe"
          :aria-invalid="!!errors.length"
        />
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <FieldSeparator />
  </FieldGroup>
</template>
<script setup lang="ts">
import { Field as VeeField, useFormContext } from 'vee-validate'
import { GENDERS } from '#shared/constants/person.constants'
import { yesNo } from '#shared/constants/common.constants'
import { APPLICATION_SOURCES } from '#shared/constants/employment.constants'
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { DistrictSelectGroups } from '@/shared/components/forms/district-select'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { EmploymentApplicationFormValues } from '@/features/employment-application/types/employment_application_form.types'

const { values } = useFormContext<EmploymentApplicationFormValues>()
</script>
