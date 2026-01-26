<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <Users class="w-5 h-5" />
      Informations personnelles
    </h3>
    <VeeField v-slot="{ field, errors }" name="civilTitle">
      <Field :data-invalid="!!errors.length">
        <div class="space-y-2">
          <FieldContent>
            <FieldLabel :for="field.name">Titre de civilité *</FieldLabel>
          </FieldContent>
          <Select
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
            required
          >
            <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
              <SelectValue placeholder="Sélectionnez un titre de civilité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="cTitle of CIVIL_TITLES" :value="cTitle.id">
                {{ cTitle.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="maritalStatus">
      <Field :data-invalid="!!errors.length">
        <div class="space-y-2">
          <FieldContent>
            <FieldLabel :for="field.name">État matrimonial *</FieldLabel>
          </FieldContent>
          <Select
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
            required
          >
            <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
              <SelectValue placeholder="Sélectionnez un état matrimonial" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="mStatus of MARITAL_STATUS" :value="mStatus.id">
                  {{ mStatus.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </Field>
    </VeeField>

    <div class="grid md:grid-cols-2 gap-4">
      <template
        v-for="item of [
          { id: 'firstname', label: 'Prénom', placeholder: 'John' },
          { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
        ]"
        :key="item.id"
      >
        <VeeField
          v-slot="{ field, componentField, errors }"
          :name="item.id"
          :validate-on-blur="!isFieldDirty"
        >
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldLabel :for="field.name">{{ item.label }} *</FieldLabel>
              <Input
                :id="field.name"
                v-bind="componentField"
                :placeholder="item.placeholder"
                :aria-invalid="!!errors.length"
                required
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>
      </template>

      <VeeField v-slot="{ field, errors }" name="gender">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldContent>
              <FieldLabel :for="field.name">Sexe *</FieldLabel>
            </FieldContent>
            <Select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              required
            >
              <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Sélectionnez un genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="gender of GENDERS" :value="gender.id">
                    {{ gender.label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, setValue }" name="age">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldLabel :for="field.name">Âge *</FieldLabel>
            <NumberField
              :id="field.name"
              :min="16"
              :max="120"
              :model-value="field.value ?? null"
              @update:model-value="
                (v) => {
                  if (v) {
                    setValue(v)
                  } else {
                    setValue(undefined)
                  }
                }
              "
              required
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput :id="field.name" :aria-invalid="!!errors.length" />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>
    </div>

    <VeeField v-slot="{ field, errors }" name="ethnicCommunity">
      <Field :data-invalid="!!errors.length">
        <div class="space-y-2">
          <FieldContent>
            <FieldLabel :for="field.name">
              Êtes-vous membre d'une communauté ethnique spécifique ?
            </FieldLabel>
          </FieldContent>
          <Select
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          >
            <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
              <SelectValue placeholder="Sélectionner une communauté" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="community of LOCAL_ETHNICS_COMMUNITIES" :value="community.id">
                  {{ community.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </Field>
    </VeeField>

    <VeeField v-slot="{ field, errors }" name="occupation" :validate-on-blur="!isFieldDirty">
      <Field :data-invalid="!!errors.length">
        <div class="space-y-2">
          <FieldLabel :for="field.name">Activité / Emploi</FieldLabel>
          <Input
            :id="field.name"
            v-bind="field"
            placeholder="Votre activité ou travail"
            :aria-invalid="!!errors.length"
          />
          <FieldError v-if="errors.length" :errors="errors" />
        </div>
      </Field>
    </VeeField>
  </div>
</template>

<script setup lang="ts">
import { CIVIL_TITLES, GENDERS, MARITAL_STATUS } from '#shared/constants/person.constants'
import { LOCAL_ETHNICS_COMMUNITIES } from '#shared/constants/ethnicity.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Users } from 'lucide-vue-next'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField, useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'

const { isFieldDirty } = useFormContext<RegisterParishionerFormValues>()
</script>
