<template>
  <form @submit="submitForm" class="space-y-6">
    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="item of [
          { id: 'firstname', label: 'Prénom', placeholder: 'John' },
          { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
        ]"
        :key="item.id"
      >
        <VeeField v-slot="{ componentField, errors: fieldErrors }" :name="item.id">
          <Field :data-invalid="!!fieldErrors.length">
            <FieldLabel :for="item.id" class="block text-sm font-medium text-gray-700">
              {{ item.label }} *
            </FieldLabel>
            <Input
              :id="item.id"
              v-bind="componentField"
              type="text"
              :placeholder="item.placeholder"
              :aria-invalid="!!fieldErrors.length"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
            />
            <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
          </Field>
        </VeeField>
      </div>
    </div>

    <div>
      <VeeField v-slot="{ field, errors: fieldErrors }" name="phone">
        <Field :data-invalid="!!fieldErrors.length">
          <FieldLabel :for="field.name" class="block text-sm font-medium text-gray-700">
            Téléphone *
          </FieldLabel>
          <Input
            :id="field.name"
            v-bind="field"
            type="tel"
            placeholder="1234"
            :aria-invalid="!!fieldErrors.length"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
          />
          <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
        </Field>
      </VeeField>
    </div>

    <div>
      <VeeField v-slot="{ field, errors: fieldErrors }" name="subject">
        <Field :data-invalid="!!fieldErrors.length">
          <FieldLabel :for="field.name" class="block text-sm font-medium text-gray-700 mb-1">
            Sujet *
          </FieldLabel>
          <Select
            :model-value="field.value"
            @update:model-value="field.onChange"
            @blur="field.onBlur"
          >
            <SelectTrigger
              :id="field.name"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
              :aria-invalid="!!fieldErrors.length"
            >
              <SelectValue placeholder="Choisissez un sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in props.subjects" :key="item.id" :value="item.id">
                  {{ item.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
        </Field>
      </VeeField>
    </div>

    <div>
      <VeeField v-slot="{ field, errors: fieldErrors }" name="message">
        <Field :data-invalid="!!fieldErrors.length">
          <FieldLabel :for="field.name" class="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </FieldLabel>
          <Textarea
            :id="field.name"
            v-bind="field"
            :rows="6"
            :maxlength="2000"
            placeholder="Décrivez votre demande en détail..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
            :aria-invalid="!!fieldErrors.length"
          />
          <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
        </Field>
      </VeeField>
    </div>

    <Button
      type="submit"
      size="lg"
      class="w-full bg-catholic-gold hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isSubmitting"
    >
      <component
        :is="isSubmitting ? Loader2 : Send"
        :class="['size-5 mr-2', isSubmitting && 'animate-spin']"
      />
      {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
    </Button>

    <p class="text-sm text-gray-500">* Champs obligatoires</p>
  </form>
</template>
<script setup lang="ts">
import { Loader2, Send } from 'lucide-vue-next'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { Field as VeeField, useForm } from 'vee-validate'
import { watch } from 'vue'
import { router } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import { toast } from 'vue-sonner'
import { useCurrentCharacter } from '@/shared/composables/use_current_character'
import { usePageProps } from '@/shared/composables/use_page_props'
import { useErrors } from '@/shared/composables/use_errors'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type ContactController from '#contact/controllers/contact_controller'
import { toTypedSchema } from '@vee-validate/zod'
import { contactSchema } from '@/features/contact/schemas/contact.schema'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'

const props = usePageProps<{ subjects: InferPageProps<ContactController, 'index'>['subjects'] }>()
const errors = useErrors()

const currentCharacter = useCurrentCharacter()

const { handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(contactSchema),
  initialValues: {
    firstname: currentCharacter.value?.firstname || '',
    lastname: currentCharacter.value?.lastname || '',
    phone: '',
    subject: undefined,
    message: '',
  },
})

watch(
  () => errors.value,
  (newErrors: Record<string, string | string[]>) => {
    if (newErrors && Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    }
  },
  { immediate: true }
)

const submitForm = handleSubmit((values) => {
  router.post(tuyau.contact.$url(), values, {
    preserveScroll: true,
    onSuccess: () => {
      if (props.value.success) {
        resetForm()
        return toast.success(props.value.success || 'Submitted!')
      }
      toast.error(errors.value.CONTACT_ERROR || 'An error occured')
    },
    onError: (err) => {
      if (err) {
        return toast.error('Veuillez corriger les erreurs dans le formulaire')
      }
    },
  })
})
</script>
