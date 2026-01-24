<template>
  <Card class="relative">
    <CardContent class="pt-6">
      <div class="absolute top-4 right-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="$emit('remove')"
          class="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <span class="sr-only">Supprimer</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <div class="grid md:grid-cols-2 gap-4 pr-10">
        <VeeField v-slot="{ field, errors }" :name="`familyMembers[${index}].firstname`">
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldLabel :for="field.name">Prénom *</FieldLabel>
              <Input
                :id="field.name"
                v-bind="field"
                required
                placeholder="Prénom"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" :name="`familyMembers[${index}].lastname`">
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldLabel :for="field.name">Nom de famille *</FieldLabel>
              <Input
                :id="field.name"
                v-bind="field"
                required
                placeholder="Nom de famille"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" :name="`familyMembers[${index}].age`">
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldLabel :for="field.name">Âge *</FieldLabel>
              <Input
                :id="field.name"
                v-bind="field"
                type="number"
                min="0"
                max="120"
                placeholder="Âge"
                required
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" :name="`familyMembers[${index}].role`">
          <Field :data-invalid="!!errors.length">
            <div class="space-y-2">
              <FieldContent>
                <FieldLabel :for="field.name">Rôle dans le foyer *</FieldLabel>
              </FieldContent>
              <Select
                :model-value="field.value"
                @update:model-value="field.onChange"
                @blur="field.onBlur"
                required
              >
                <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="role in HOUSEHOLD_ROLES" :key="role.id" :value="role.id">
                    {{ role.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError v-if="errors.length" :errors="errors" />
            </div>
          </Field>
        </VeeField>
      </div>

      <VeeField v-slot="{ field, errors }" type="checkbox" :name="`familyMembers[${index}].isNpc`">
        <Field
          orientation="horizontal"
          class="flex flex-row items-center gap-x-2 mt-2"
          :data-invalid="!!errors.length"
        >
          <Checkbox
            :id="field.name"
            :model-value="field.value"
            :aria-invalid="!!errors.length"
            @update:model-value="field.onChange"
          />
          <div class="space-y-1 leading-none">
            <FieldLabel :for="field.name" class="inline text-sm">
              (( C'est un personnage non-joueur (PNJ) ))
            </FieldLabel>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { HOUSEHOLD_ROLES } from '#shared/constants/person.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'

defineProps<{ index: number }>()
defineEmits<{ remove: [] }>()
</script>
