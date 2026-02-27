<template>
  <VeeFieldArray v-slot="{ fields }" name="professionalExperience">
    <FieldSet class="gap-6">
      <FieldGroup class="gap-6">
        <Empty
          v-if="fields.length === 0"
          class="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg"
        >
          <EmptyMedia variant="icon">
            <Briefcase />
          </EmptyMedia>
          <EmptyTitle>Aucune expérience professionnelle ajoutée</EmptyTitle>
          <EmptyContent>
            <Button type="button" size="sm" @click="addLine()">
              <Plus />
              Ajouter une expérience
            </Button>
          </EmptyContent>
        </Empty>

        <div
          v-for="(field, index) in fields"
          :key="field.key"
          class="border rounded-lg p-4 sm:p-6 space-y-4 bg-card"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div
                class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary"
              >
                {{ index + 1 }}
              </div>
              <h4 class="font-medium text-sm sm:text-base">Expérience #{{ index + 1 }}</h4>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              :aria-label="`Supprimer l'expérience ${index + 1}`"
              @click="remove(index)"
            >
              <Trash2 class="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <Separator />

          <div class="space-y-4">
            <VeeField
              v-slot="{ field: fieldProps, errors: fieldErrors }"
              :name="`professionalExperience[${index}].companyName`"
            >
              <Field :data-invalid="!!fieldErrors.length">
                <FieldLabel :for="`company-${index}`">Nom de la compagnie</FieldLabel>
                <Input
                  :id="`company-${index}`"
                  v-bind="fieldProps"
                  type="text"
                  placeholder="Ex: Eternal Word Television Network"
                  :maxlength="100"
                  :aria-invalid="!!fieldErrors.length"
                />
                <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
              </Field>
            </VeeField>

            <VeeField
              v-slot="{ field: fieldProps, errors: fieldErrors }"
              :name="`professionalExperience[${index}].position`"
            >
              <Field :data-invalid="!!fieldErrors.length">
                <FieldLabel :for="`position-${index}`">Poste / Fonction</FieldLabel>
                <Input
                  :id="`position-${index}`"
                  v-bind="fieldProps"
                  type="text"
                  placeholder="Ex: Assistant administratif"
                  :maxlength="100"
                  :aria-invalid="!!fieldErrors.length"
                />
                <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
              </Field>
            </VeeField>

            <VeeField
              v-slot="{ value, field: fieldProps, errors: fieldErrors }"
              :name="`professionalExperience[${index}].isCurrentPosition`"
              type="checkbox"
            >
              <Field orientation="horizontal" :data-invalid="!!fieldErrors.length">
                <Checkbox
                  :id="`current-position-${index}`"
                  :model-value="!!value"
                  :aria-invalid="!!fieldErrors.length"
                  @update:model-value="
                    (v) => {
                      if (v === 'indeterminate') fieldProps.onChange(false)
                      fieldProps.onChange(v)
                    }
                  "
                />
                <div class="flex-1 space-y-1 leading-none">
                  <FieldLabel :for="`current-position-${index}`" class="cursor-pointer">
                    Je travaille actuellement à ce poste
                  </FieldLabel>
                  <FieldDescription class="text-xs">
                    Cochez cette case si vous occupez toujours ce poste
                  </FieldDescription>
                </div>
                <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
              </Field>
            </VeeField>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <VeeField
                v-slot="{ field: fieldProps, errors: fieldErrors }"
                :name="`professionalExperience[${index}].startDate`"
              >
                <Field :data-invalid="!!fieldErrors.length">
                  <FieldLabel :for="`start-date-${index}`">Date de début</FieldLabel>
                  <Input
                    :id="`start-date-${index}`"
                    v-bind="fieldProps"
                    type="month"
                    :aria-invalid="!!fieldErrors.length"
                  />
                  <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
                </Field>
              </VeeField>

              <VeeField
                v-slot="{ field: fieldProps, errors: fieldErrors }"
                :name="`professionalExperience[${index}].endDate`"
                v-if="!values.professionalExperience?.[index]?.isCurrentPosition"
              >
                <Field :data-invalid="!!fieldErrors.length">
                  <FieldLabel :for="`end-date-${index}`">Date de fin</FieldLabel>
                  <Input
                    :id="`end-date-${index}`"
                    v-bind="fieldProps"
                    type="month"
                    :aria-invalid="!!fieldErrors.length"
                  />
                  <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
                </Field>
              </VeeField>
            </div>

            <VeeField
              v-if="
                values.professionalExperience &&
                !values.professionalExperience[index]?.isCurrentPosition
              "
              v-slot="{ field: fieldProps, errors: fieldErrors }"
              :name="`professionalExperience[${index}].reasonForLeaving`"
            >
              <Field :data-invalid="!!fieldErrors.length">
                <FieldLabel :for="`reason-${index}`">Raison du départ</FieldLabel>
                <FieldContent>
                  <Input
                    :id="`reason-${index}`"
                    v-bind="fieldProps"
                    placeholder="Ex: Nouvelle opportunité, relocation, fin de contrat..."
                    :maxlength="255"
                    :aria-invalid="!!fieldErrors.length"
                  />
                  <FieldDescription class="text-xs"> Maximum 255 caractères </FieldDescription>
                  <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
                </FieldContent>
              </Field>
            </VeeField>
          </div>
        </div>

        <Button
          v-if="fields.length > 0"
          type="button"
          variant="outline"
          size="default"
          class="w-full sm:w-auto"
          :disabled="fields.length >= 3"
          @click="addLine()"
        >
          <Plus class="mr-2 h-4 w-4" />
          Ajouter une expérience
          <span v-if="fields.length > 0" class="ml-2 text-muted-foreground text-xs">
            ({{ fields.length }}/3)
          </span>
        </Button>

        <FieldError v-if="errors" :errors="[errors]" />
      </FieldGroup>
    </FieldSet>
  </VeeFieldArray>
</template>

<script setup lang="ts">
import {
  Field as VeeField,
  FieldArray as VeeFieldArray,
  useFieldArray,
  useFieldError,
  useFormContext,
} from 'vee-validate'
import { Briefcase, Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/components/ui/field'
import { Empty, EmptyContent, EmptyMedia, EmptyTitle } from '@/shared/components/ui/empty'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { EmploymentApplicationFormValues } from '@/features/employment-application/types/employment_application_form.types'
import { Separator } from '@/shared/components/ui/separator'

const errors = useFieldError('professionalExperience')
const { values } = useFormContext<EmploymentApplicationFormValues>()

const { push, remove } =
  useFieldArray<EmploymentApplicationFormValues['professionalExperience'][number]>(
    'professionalExperience'
  )

const addLine = () => {
  push({
    companyName: '',
    position: '',
    isCurrentPosition: false,
    reasonForLeaving: '',
    startDate: '',
    endDate: undefined,
  })
}
</script>
