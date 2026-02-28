<template>
  <form :id="id" @submit="onSubmit">
    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contenu</CardTitle>
            <CardDescription>
              Renseignez les informations principales de l'offre d'emploi
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <VeeField v-slot="{ field, errors }" name="employmentType">
              <Field orientation="responsive" :data-invalid="!!errors.length">
                <FieldContent>
                  <FieldLabel :for="field.name">Type d'emploi *</FieldLabel>
                  <FieldError v-if="errors.length" :errors="errors" />
                </FieldContent>
                <Select
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                >
                  <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    <SelectItem
                      v-for="(label, index) of EMPLOYMENT_TYPE"
                      :key="index"
                      :value="index"
                    >
                      {{ label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </VeeField>

            <JobDashboardTitleSlugFields :auto-slug="autoSlug" />

            <VeeField v-slot="{ field, errors }" name="summary">
              <Field :data-invalid="!!errors.length">
                <FieldLabel :for="field.name">Description</FieldLabel>
                <Textarea
                  :id="field.name"
                  :model-value="field.value"
                  @update:model-value="field.onChange"
                  @blur="field.onBlur"
                  placeholder="Courte description de l'emploi..."
                  :rows="3"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <JobDashboardAffiliationFields />

            <VeeField v-slot="{ field, errors }" name="salary">
              <Field :data-invalid="!!errors.length">
                <FieldLabel :for="field.name">Salaire hebdomadaire *</FieldLabel>
                <NumberField
                  class="gap-2"
                  :min="0"
                  :format-options="{
                    style: 'currency',
                    currency: 'USD',
                    currencyDisplay: 'symbol',
                    currencySign: 'accounting',
                  }"
                  :model-value="field.value"
                  @update:model-value="
                    (v) => {
                      if (v) {
                        form.setFieldValue('salary', v)
                      } else {
                        form.setFieldValue('salary', undefined as unknown as number)
                      }
                    }
                  "
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

            <JobDashboardResponsibilitiesField />

            <JobDashboardRequirementsField />

            <JobDashboardSkillsField />
          </CardContent>
        </Card>
      </div>

      <JobDashboardFormSidebar :variant="variant" :form-id="id" />
    </div>
  </form>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Field as VeeField } from 'vee-validate'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { EMPLOYMENT_TYPE } from '#shared/constants/employment.constants'
import {
  useDashboardCreateJobForm,
  useDashboardEditJobForm,
} from '@/features/jobs/composables/dashboard/use_dashboard_job_form'
import JobDashboardResponsibilitiesField from '@/features/jobs/components/form/dashboard/JobDashboardResponsibilitiesField.vue'
import JobDashboardRequirementsField from '@/features/jobs/components/form/dashboard/JobDashboardRequirementsField.vue'
import JobDashboardAffiliationFields from '@/features/jobs/components/form/dashboard/JobDashboardAffiliationFields.vue'
import JobDashboardFormSidebar from '@/features/jobs/components/form/dashboard/JobDashboardFormSidebar.vue'
import JobDashboardTitleSlugFields from '@/features/jobs/components/form/dashboard/JobDashboardTitleSlugFields.vue'
import JobDashboardSkillsField from '@/features/jobs/components/form/dashboard/JobDashboardSkillsField.vue'

const props = withDefaults(
  defineProps<{
    form: ReturnType<typeof useDashboardCreateJobForm> | ReturnType<typeof useDashboardEditJobForm>
    id?: string
    autoSlug?: boolean
    variant?: 'create' | 'edit'
  }>(),
  {
    id: 'create-job-offer-form',
    autoSlug: true,
    variant: 'create' as const,
  }
)

const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void
}>()

const onSubmit = props.form.handleSubmit((values) => {
  emit('submit', values)
})
</script>
