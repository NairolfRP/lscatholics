<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Publication</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <VeeField v-slot="{ field, errors, setValue }" name="isActive" class="space-y-2">
          <Field orientation="responsive" :data-invalid="!!errors.length">
            <FieldContent>
              <FieldLabel :for="field.name">Statut</FieldLabel>
              <FieldError v-if="errors.length" :errors="errors" />
            </FieldContent>
            <Select
              :model-value="field.value ? 'yes' : 'no'"
              @update:model-value="
                (v) => {
                  if (v === 'yes') {
                    setValue(true)
                    return
                  }
                  setValue(false)
                }
              "
              @blur="field.onBlur"
            >
              <SelectTrigger :id="field.name" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Actif</SelectItem>
                <SelectItem value="no">Fermée</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </VeeField>

        <JobDashboardDatesFields />

        <Field>
          <div class="flex gap-2">
            <template v-if="variant === 'edit'">
              <Button type="submit" :form="formId" class="flex-1">Mettre à jour</Button>
            </template>
            <template v-else>
              <Button type="submit" :form="formId" class="flex-1">
                {{ form.values.isActive ? 'Publier' : 'Enregistrer' }}
              </Button>
            </template>
            <Button type="button" variant="outline" as-child>
              <Link :href="urlFor('dashboard.dashboard_jobs.index')"> Annuler </Link>
            </Button>
          </div>
        </Field>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Field as VeeField, useFormContext } from 'vee-validate'
import { urlFor } from '@/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import JobDashboardDatesFields from '@/features/jobs/components/form/dashboard/JobDashboardDatesFields.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@inertiajs/vue3'

const form = useFormContext()

defineProps<{
  formId?: string
  variant?: 'create' | 'edit'
}>()
</script>
