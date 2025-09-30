<template>
  <Head title="Faire un don" :image="DonateHero" />
  <PageBanner :bg-image="DonateHero" align="text-left">
    <Typography variant="h1" class="text-4xl md:text-5xl font-bold mb-4 font-serif">
      Soutenir notre communauté
    </Typography>
  </PageBanner>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-900 mb-4">Aidez notre mission</h2>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Votre générosité contribue à la mission de l'Église, à fournir une aide aux plus pauvres et
        à preserver le patrimoine local.
      </p>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <Tabs default-value="oneTime">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger
            class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="oneTime"
          >
            Don ponctuel
          </TabsTrigger>
          <TabsTrigger
            class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="recurring"
          >
            Don périodique
          </TabsTrigger>
        </TabsList>
        <TabsContent value="oneTime">
          <form @submit.prevent="submitDonation">
            <Card class="p-6">
              <CardHeader>
                <CardTitle class="text-2xl font-semibold text-gray-900"> Faire un don </CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <MoneyInput
                  name="amount"
                  label="Montant du don"
                  :predefined-amounts="predefinedAmounts"
                  currency="USD"
                  locale="fr-FR"
                />

                <!-- Personal Information -->
                <div class="space-y-4 pt-4 border-t">
                  <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      v-for="field of [
                        { id: 'firstname', label: 'Prénom', placeholder: 'John' },
                        { id: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
                      ]"
                      v-slot="{ componentField }"
                      :name="field.id"
                    >
                      <FormItem>
                        <FormLabel>{{ field.label }} *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            :placeholder="field.placeholder"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <div class="flex flex-col space-y-4">
                    <FormField
                      v-slot="{ value, handleChange }"
                      type="checkbox"
                      name="isOrganization"
                    >
                      <FormItem>
                        <div class="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox :model-value="value" @update:model-value="handleChange" />
                          </FormControl>
                          <FormLabel class="text-sm">
                            Je fais un don au nom d'une organisation ou d'une société
                          </FormLabel>
                        </div>
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="organizationName">
                      <FormItem>
                        <div
                          v-if="values.isOrganization"
                          class="space-y-3 pl-6 border-l-2 border-gray-200"
                        >
                          <FormLabel>Nom de l'organisation *</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Doe Corporation"
                              v-bind="componentField"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    </FormField>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField v-slot="{ value }" name="age">
                      <FormItem>
                        <NumberField
                          id="age"
                          :min="0"
                          :model-value="value"
                          @update:model-value="
                            (v) => {
                              if (v) {
                                setFieldValue('age', v)
                              } else {
                                setFieldValue('age', undefined)
                              }
                            }
                          "
                        >
                          <FormLabel>Âge</FormLabel>
                          <NumberFieldContent>
                            <NumberFieldDecrement />
                            <FormControl>
                              <NumberFieldInput />
                            </FormControl>
                            <NumberFieldIncrement />
                          </NumberFieldContent>
                        </NumberField>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value }" name="ethnicity" class="space-y-1.5">
                      <FormItem>
                        <FormLabel>Ethnie</FormLabel>
                        <Select
                          :model-value="value"
                          @update:model-value="
                            (v) => {
                              if (v !== 'null') {
                                setFieldValue('ethnicity', v as EthnicGroupId)
                              } else {
                                setFieldValue('ethnicity', undefined)
                              }
                            }
                          "
                        >
                          <FormControl>
                            <SelectTrigger class="w-full">
                              <SelectValue placeholder="Sélectionnez une ethnie" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="null" :disabled="!value"> N/A </SelectItem>
                              <SelectSeparator />
                              <SelectItem
                                v-for="ethnicGroup of ETHNIC_GROUPS"
                                :value="ethnicGroup.id"
                              >
                                {{ ethnicGroup.label }}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="phone">
                    <FormItem>
                      <FormLabel>Numéro de téléphone</FormLabel>
                      <FormControl>
                        <Input type="tel" v-bind="componentField" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="address">
                      <FormItem>
                        <FormLabel>Adresse</FormLabel>
                        <FormControl>
                          <Input type="text" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ value }" name="district">
                      <FormItem>
                        <FormLabel>District {{ values.address ? '*' : '' }}</FormLabel>
                        <Select
                          :model-value="value"
                          @update:model-value="
                            (v) => {
                              if (v && v !== 'null') {
                                setFieldValue('district', v as GTA5DistrictId)
                              } else {
                                setFieldValue('district', undefined)
                              }
                            }
                          "
                        >
                          <FormControl>
                            <SelectTrigger class="w-full">
                              <SelectValue placeholder="Sélectionnez un district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="null" :disabled="!value"> N/A </SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Los Santos</SelectLabel>
                              <SelectItem
                                v-for="lsDistrict of getLSDistricts().toSorted((a, b) =>
                                  a.label.localeCompare(b.label)
                                )"
                                :value="lsDistrict.id"
                              >
                                {{ lsDistrict.label }}
                              </SelectItem>
                            </SelectGroup>
                            <SelectSeparator />
                            <SelectGroup>
                              <SelectLabel>Autre ville/district</SelectLabel>
                              <SelectItem
                                v-for="lsDistrict of getNorthDistricts().toSorted((a, b) =>
                                  a.label.localeCompare(b.label)
                                )"
                                :value="lsDistrict.id"
                              >
                                {{ lsDistrict.label }}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </div>

                <!-- Anonymous Option -->
                <FormField v-slot="{ value, handleChange }" type="checkbox" name="anonymous">
                  <FormItem class="flex flex-row items-center gap-x-2">
                    <FormControl>
                      <Checkbox :model-value="value" @update:model-value="handleChange" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel class="text-sm">
                        Je souhaite que ma donation reste privée, ce qui veut dire qu'elle ne sera
                        ni affichée ni communiquée publiquement.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                </FormField>

                <FormField
                  v-slot="{ value, handleChange }"
                  type="checkbox"
                  name="fleecaConfirmation"
                >
                  <FormItem class="flex flex-row items-center gap-x-2">
                    <FormControl>
                      <Checkbox :model-value="value" @update:model-value="handleChange" />
                    </FormControl>
                    <div class="space-y-1 leading-none">
                      <FormLabel class="inline text-sm">
                        (( Je confirme que je suis BIEN CONNECTÉ sur l'<LinkText
                          href="https://fleeca.gta.world"
                          target="_blank"
                          external
                          >application web Fleeca</LinkText
                        >
                        de GTA World. Dans le cas contraire, la redirection vers le paiement
                        échouera et tout devra être recommencé.))
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                </FormField>
              </CardContent>

              <CardFooter class="pt-6">
                <Button type="submit" :disabled="isSubmitting" class="w-full">
                  Donner
                  {{
                    new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'USD',
                      currencyDisplay: 'symbol',
                      maximumFractionDigits: 0,
                    })
                      .format(values.amount || 0)
                      .replace('US', '')
                      .trim()
                  }}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
        <TabsContent value="recurring">
          <RecurringDonationInfo />
        </TabsContent>
      </Tabs>

      <DonationSidebar />
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Head, router } from '@inertiajs/vue3'
import PageBanner from '@/components/layout/PageBanner.vue'
import DonateHero from '@/assets/images/donate-background.png'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { LinkText } from '@/components/ui/LinkText'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ETHNIC_GROUPS, type EthnicGroupId } from '#shared/constants/ethnicity.constants'
import {
  getLSDistricts,
  getNorthDistricts,
  type GTA5DistrictId,
} from '#shared/constants/districts.constants'
import { useCurrentCharacter } from '@/composables/use_current_character'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { donateSchema } from '@/validations/donate.schema'
import { toTypedSchema } from '@vee-validate/zod'
import { MoneyInput } from '@/components/forms/money-input'
import RecurringDonationInfo from '@/components/donation/RecurringDonationInfo.vue'
import DonationSidebar from '@/components/donation/DonationSidebar.vue'
import { tuyau } from '@/lib/tuyau'
import { toast } from 'vue-sonner'

const currentCharacter = useCurrentCharacter()

const { handleSubmit, isSubmitting, values, setFieldValue, setErrors, resetForm } = useForm({
  validationSchema: toTypedSchema(donateSchema),
  initialValues: {
    amount: undefined as number | undefined,
    firstname: currentCharacter.value?.firstname || '',
    lastname: currentCharacter.value?.lastname || '',
    age: undefined as number | undefined,
    ethnicity: undefined,
    phone: '',
    address: '',
    district: undefined,
    isOrganization: false,
    organizationName: '',
    anonymous: false,
    fleecaConfirmation: false,
  },
})

const predefinedAmounts = [100000, 50000, 20000, 10000, 5000]

const submitDonation = handleSubmit((formValues) => {
  router.post(tuyau.donate.$url(), formValues, {
    preserveScroll: true,
    preserveState: true,
    onSuccess: (page) => {
      const paymentUrl = page?.props?.paymentUrl as string | undefined
      if (!paymentUrl) {
        return toast.error('Échec', {
          description: "Impossible de récupérer l'URL pour le paiement",
        })
      }
      openPaymentPopup(paymentUrl)
    },
    onError: (err) => {
      if (err) {
        if (!('E_DONATE_ERROR' in err)) {
          setErrors(err)
          return toast.error('Champs invalides', {
            description: 'Veuillez corriger les erreurs dans le formulaire',
          })
        }

        toast.error('Échec', { description: err.E_DONATE_ERROR })
      }
    },
  })
})

const openPaymentPopup = (paymentUrl: string) => {
  const width = 800
  const height = 800

  const screenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX
  const screenTop = window.screenTop !== undefined ? window.screenTop : window.screenY
  const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width
  const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height

  const left = screenLeft + (screenWidth - width) / 2
  const top = screenTop + (screenHeight - height) / 2

  const popup = window.open(
    paymentUrl,
    'fleeca-payment',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,location=no`
  )

  if (!popup) {
    toast.error('Popup bloquée. Veuillez autoriser les popups pour ce site.')
    return
  }

  const messageHandler = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    if (event.data.type === 'PAYMENT_SUCCESS') {
      toast.success(event.data.title || 'Paiement réussi !', {
        description: event.data.message,
        duration: 6000,
      })
      popup.close()
      window.removeEventListener('message', messageHandler)

      resetForm()
    } else if (event.data.type === 'PAYMENT_ERROR') {
      toast.error('Erreur de paiement', {
        description: event.data.message || 'Une erreur est survenue lors du paiement',
        duration: 8000,
      })
      popup.close()
      window.removeEventListener('message', messageHandler)
    }
  }

  window.addEventListener('message', messageHandler)

  const checkClosed = setInterval(() => {
    if (popup.closed) {
      clearInterval(checkClosed)
      window.removeEventListener('message', messageHandler)
      toast.info('Paiement annulé', { description: 'La fenêtre de paiement a été fermée' })
    }
  }, 1000)

  setTimeout(
    () => {
      if (!popup.closed) {
        popup.close()
        clearInterval(checkClosed)
        window.removeEventListener('message', messageHandler)
        toast.warning('Session de paiement expirée')
      }
    },
    15 * 60 * 1000
  )
}
</script>
