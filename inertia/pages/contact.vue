<template>
  <Head title="Contact" />

  <PageBanner py="16">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Nous Contacter</h1>
    <p class="text-xl opacity-90">
      Nous sommes là pour vous. N'hésitez pas à nous appeler ou nous écrire pour poser vos questions
      et nous faire part de vos préoccupations et commentaires.
    </p>
  </PageBanner>

  <section class="container mx-auto px-4 py-12 lg:py-16">
    <div class="max-w-4xl mx-auto">
      <Alert
        v-if="props.success || errors.CONTACT_ERROR"
        :variant="props.success ? 'default' : 'destructive'"
        role="alert"
        :aria-live="props.success ? 'polite' : 'assertive'"
        class="mb-8"
      >
        <component :is="props.success ? CheckCircle : AlertTriangle" class="size-6" />
        <AlertTitle>{{ props.success ? 'Confirmation' : 'Erreur' }}</AlertTitle>
        <AlertDescription>{{
          props.success ? props.success : errors.CONTACT_ERROR
        }}</AlertDescription>
      </Alert>
      <div class="grid md:grid-cols-2 gap-16">
        <div>
          <h2 class="text-2xl font-bold text-catholic-purple mb-6 font-serif">
            Envoyez-nous un message
          </h2>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <FormField v-slot="{ componentField }" name="firstname">
                  <FormItem>
                    <FormLabel class="block text-sm font-medium text-gray-700 mb-2"
                      >Prénom *</FormLabel
                    >
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
                    <FormLabel class="block text-sm font-medium text-gray-700 mb-2"
                      >Nom *</FormLabel
                    >
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
                  <FormLabel class="block text-sm font-medium text-gray-700 mb-2"
                    >Téléphone *</FormLabel
                  >
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
                  <FormLabel class="block text-sm font-medium text-gray-700 mb-1">
                    Sujet *
                  </FormLabel>
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
                        <SelectItem value="archbishop">Cardinal Ronan Callahan</SelectItem>
                        <SelectItem value="sacraments">Sacrements</SelectItem>
                        <SelectItem value="parishes">Paroisses</SelectItem>
                        <SelectItem value="exorcism">Service de l'Exorcisme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
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
                  <FormLabel class="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </FormLabel>
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
        </div>

        <div class="space-y-8">
          <div>
            <h2 class="text-2xl font-bold text-catholic-purple mb-6 font-serif">
              Informations de contact
            </h2>

            <Card class="p-6">
              <CardContent class="space-y-6">
                <div class="flex items-start gap-4">
                  <div
                    class="size-10 bg-catholic-gold text-white rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <MapPin class="size-5" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">
                      Tour de la Cathédrale Notre-Dame-des-Saints
                    </h3>
                    <p class="text-gray-600">
                      Ginger street, Little Seoul<br />
                      Los Santos, SA 90010<br />
                      États-Unis
                    </p>
                  </div>
                </div>

                <div class="flex items-start gap-4">
                  <div
                    class="size-10 bg-catholic-purple text-white rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Phone class="size-5" />
                  </div>
                  <div>
                    <h3 class="font-semibold text-lg mb-1">Téléphone</h3>
                    <p class="text-gray-600">
                      Accueil: 700<br />
                      Urgences: 700
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card class="bg-red-50 border-red-200">
            <CardContent class="p-6">
              <div class="flex items-start gap-3">
                <AlertTriangle class="size-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 class="font-semibold text-red-800 mb-2">Contact d'urgence</h3>
                  <p class="text-red-700 text-sm mb-3">
                    Pour les situations d'urgence spirituelle (derniers sacrements, extrême-onction,
                    confession urgente), contactez notre ligne 24h/24.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    class="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <Phone class="size-4 mr-2" />
                    700
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 class="font-semibold text-lg mb-4">Suivez-nous</h3>
            <div class="flex gap-3">
              <a
                :href="ARCHDIOCESE_FACEBROWSER_LINK"
                class="size-10 bg-red-400 text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
              >
                <Facebrower class="size-5" />
              </a>
              <a
                :href="ARCHDIOCESE_YOUTUBE_LINK"
                class="size-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <Youtube class="size-5" />
              </a>
              <a
                :href="ARCHDIOCESE_DISCORD_LINK"
                class="size-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Discord class="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-catholic-purple mb-8 text-center font-serif">
        Nous trouver
      </h2>
      <div class="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
        <p class="text-gray-600">Carte interactive - Archevêché de Los Santos</p>
        <p class="text-sm text-gray-500 mt-1">À venir prochainement</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, CheckCircle, Loader2, MapPin, Phone, Send } from 'lucide-vue-next'
import PageBanner from '@/components/layout/PageBanner.vue'
import Discord from '@/components/svg/Discord.vue'
import Facebrower from '@/components/svg/Facebrower.vue'
import {
  ARCHDIOCESE_DISCORD_LINK,
  ARCHDIOCESE_FACEBROWSER_LINK,
  ARCHDIOCESE_YOUTUBE_LINK,
} from '@/constants/archdiocese.constants'
import Youtube from '@/components/svg/Youtube.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useForm } from 'vee-validate'
import { tuyau } from '@/lib/tuyau'
import { toast } from 'vue-sonner'
import { watch } from 'vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { usePageProps } from '@/composables/use_page_props'
import { useErrors } from '@/composables/use_errors'

const props = usePageProps()
const errors = useErrors()

const { handleSubmit, isSubmitting, setErrors, resetForm } = useForm({
  initialValues: {
    firstname: '',
    lastname: '',
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
