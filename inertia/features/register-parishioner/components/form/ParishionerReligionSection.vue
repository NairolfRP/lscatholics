<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <Church class="w-5 h-5" />
      Paroisse et religion
    </h3>
    <div class="grid md:grid-cols-2 gap-4">
      <VeeField v-slot="{ field, errors }" name="baptized">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldContent>
              <FieldLabel :for="field.name">Êtes-vous baptisé ? *</FieldLabel>
            </FieldContent>
            <Select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              required
            >
              <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Sélectionnez une réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in [
                    { id: 'yes', label: 'Oui' },
                    { id: 'no', label: 'Non' },
                    { id: 'unsure', label: 'Je ne suis pas sûr' },
                  ]"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="religion">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldContent>
              <FieldLabel :for="field.name">Religion *</FieldLabel>
            </FieldContent>
            <Select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              required
            >
              <SelectTrigger :id="field.name" class="w-full" :aria-invalid="!!errors.length">
                <SelectValue placeholder="Sélectionnez une réponse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="religion in CATHOLIC_OR_OTHER"
                  :key="religion.id"
                  :value="religion.id"
                >
                  {{ religion.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError v-if="errors.length" :errors="errors" />
          </div>
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="parish">
        <Field :data-invalid="!!errors.length">
          <div class="space-y-2">
            <FieldContent>
              <FieldLabel :for="field.name">Paroisse *</FieldLabel>
            </FieldContent>
            <Select
              :model-value="field.value"
              @update:model-value="field.onChange"
              @blur="field.onBlur"
              required
            >
              <SelectTrigger class="w-full" :aria-invalid="!!errors.length">
                <SelectValue :id="field.name" placeholder="Sélectionnez une paroisse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="parish in parishes" :key="parish.id" :value="parish.id">
                  {{ parish.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldError v-if="errors.length" :errors="errors" />
            <FieldDescription>
              Indiquez une paroisse de l'archidiocèse. En général, on indique la paroisse la plus
              proche de son domicile.
            </FieldDescription>
          </div>
        </Field>
      </VeeField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATHOLIC_OR_OTHER } from '#shared/constants/person.constants'
import { parishes } from '@/shared/constants/parishes.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Church } from 'lucide-vue-next'
import { Field as VeeField } from 'vee-validate'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field'
</script>
