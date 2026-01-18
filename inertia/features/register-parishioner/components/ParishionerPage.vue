<template>
  <Head title="S'enregistrer comme paroissien" />

  <ParishionerBanner />

  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <ParishionerBenefits />

    <Card class="shadow-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Formulaire d'enregistrement comme paroissien</CardTitle>
        <CardDescription>
          Veuilez remplir les informations ci-dessous pour enregistrer votre foyer comme
          paroissiens.<br /><br />

          <span class="font-bold">
            Seuls les champs indiqués avec un astérisque (*) sont obligatoires.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthentificationRequiredAlert v-if="!user" text="pour enregistrer votre foyer en ligne." />
        <form v-else @submit.prevent="onSubmit" class="space-y-8">
          <div class="space-y-4">
            <!-- <FormField v-slot="{ componentField }" type="radio" name="recordType">
              <div class="space-y-2 my-5">
                <FormItem>
                  <FormLabel class="font-bold mb-2">
                    S'agit t-il d'un nouvel enregistrement ou d'une mise à jour d'un enregistrement
                    existant ?
                  </FormLabel>

                  <FormControl>
                    <RadioGroup
                      v-bind="componentField"
                      :orientation="'horizontal'"
                      class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:gap-8"
                      required
                    >
                      <FormItem
                        v-for="option in recordTypeOptions"
                        :key="option.value"
                        class="flex items-center space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem :value="option.value" />
                        </FormControl>
                        <FormLabel class="font-normal">{{ option.label }}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </FormField> --->

            <ParishionerPersonalInfoSection />
          </div>

          <ParishionerContactInfoSection />

          <ParishionerAddressSection />

          <ParishionerReligionSection />

          <ParishionerHouseholdMembersSection />

          <ParishionerAdditionalInfoSection />

          <Separator />

          <ParishionerOOCSection />

          <div class="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              size="lg"
              :disabled="isSubmitting || isValidating || meta.pending || !meta.valid || !meta.dirty"
            >
              <template v-if="isSubmitting">
                <LoaderCircle class="animate-spin" />
                Soumission...
              </template>
              <template v-else>Soumettre l'enregistrement</template>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <div class="mt-8 text-center text-sm text-muted-foreground">
      <p>
        Vos informations resteront confidentielles et ne seront utilisées que pour la correspondance
        et les services des paroisses.
      </p>
      <p class="mt-2">Des questions ? <LinkText route="contact">Contactez-nous</LinkText></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Head from '@/shared/components/AppHead.vue'
import ParishionerBanner from '@/features/register-parishioner/components/ParishionerBanner.vue'
import ParishionerBenefits from '@/features/register-parishioner/components/ParishionerBenefits.vue'
import { Separator } from '@/shared/components/ui/separator'
import { LoaderCircle } from 'lucide-vue-next'
import AuthentificationRequiredAlert from '@/shared/components/AuthentificationRequiredAlert.vue'
import { LinkText } from '@/shared/components/ui/LinkText'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import ParishionerReligionSection from '@/features/register-parishioner/components/form/ParishionerReligionSection.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import ParishionerOOCSection from '@/features/register-parishioner/components/form/ParishionerOOCSection.vue'
import ParishionerHouseholdMembersSection from '@/features/register-parishioner/components/form/ParishionerHouseholdMembersSection.vue'
import ParishionerPersonalInfoSection from '@/features/register-parishioner/components/form/ParishionerPersonalInfoSection.vue'
import { Button } from '@/shared/components/ui/button'
import ParishionerAddressSection from '@/features/register-parishioner/components/form/ParishionerAddressSection.vue'
import ParishionerContactInfoSection from '@/features/register-parishioner/components/form/ParishionerContactInfoSection.vue'
import ParishionerAdditionalInfoSection from '@/features/register-parishioner/components/form/ParishionerAdditionalInfoSection.vue'
import { useUser } from '@/shared/composables/use_user'
import { useParishionerFormSubmission } from '@/features/register-parishioner/composables/use_parishioner_form_submission'
import { useParishionerForm } from '@/features/register-parishioner/composables/use_parishioner_form'

const user = useUser()

const recordTypeOptions = [
  { value: 'new', label: 'Nouvel enregistrement' },
  { value: 'update', label: "Mise à jour d'un enregistrement" },
]

const form = useParishionerForm()
const { isSubmitting, isValidating, meta } = form
const { onSubmit } = useParishionerFormSubmission(form)
</script>
