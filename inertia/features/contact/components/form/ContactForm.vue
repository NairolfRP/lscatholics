<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <FormField v-slot="{ componentField }" name="firstname">
          <FormItem>
            <FormLabel class="block text-sm font-medium text-gray-700 mb-2">Prénom *</FormLabel>
          </FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="John"
              v-bind="componentField"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
            />
          </FormControl>
          <FormMessage />
        </FormField>
      </div>
      <div>
        <FormField v-slot="{ componentField }" name="lastname">
          <FormItem>
            <FormLabel class="block text-sm font-medium text-gray-700 mb-2">Nom *</FormLabel>
          </FormItem>
          <FormControl>
            <Input
              type="text"
              placeholder="Doe"
              v-bind="componentField"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
            />
          </FormControl>
          <FormMessage />
        </FormField>
      </div>
    </div>

    <div>
      <FormField v-slot="{ componentField }" name="phone">
        <FormItem>
          <FormLabel class="block text-sm font-medium text-gray-700 mb-2">Téléphone *</FormLabel>
        </FormItem>
        <FormControl>
          <Input
            type="tel"
            placeholder="1234"
            v-bind="componentField"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
          />
        </FormControl>
        <FormMessage />
      </FormField>
    </div>

    <div>
      <FormField v-slot="{ componentField }" name="subject">
        <FormItem>
          <FormLabel class="block text-sm font-medium text-gray-700 mb-1"> Sujet * </FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
              >
                <SelectValue placeholder="Choisissez un sujet" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in props.subjects" :key="item.id" :value="item.id">
                  {{ item.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <div>
      <FormField v-slot="{ componentField }" name="message">
        <FormItem>
          <FormLabel class="block text-sm font-medium text-gray-700 mb-1"> Message * </FormLabel>
          <FormControl>
            <Textarea
              v-bind="componentField"
              rows="6"
              :maxlength="2000"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-catholic-gold focus:border-transparent"
              placeholder="Décrivez votre demande en détail..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { useForm } from 'vee-validate'
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
