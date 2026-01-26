<template>
  <form @submit="onSubmit" class="space-y-8">
    <ParishionerPersonalInfoSection />

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
</template>

<script setup lang="ts">
import { Separator } from '@/shared/components/ui/separator'
import { LoaderCircle } from 'lucide-vue-next'
import ParishionerOOCSection from '@/features/register-parishioner/components/form/ParishionerOOCSection.vue'
import { Button } from '@/shared/components/ui/button'
import ParishionerContactInfoSection from '@/features/register-parishioner/components/form/ParishionerContactInfoSection.vue'
import ParishionerAddressSection from '@/features/register-parishioner/components/form/ParishionerAddressSection.vue'
import ParishionerAdditionalInfoSection from '@/features/register-parishioner/components/form/ParishionerAdditionalInfoSection.vue'
import ParishionerReligionSection from '@/features/register-parishioner/components/form/ParishionerReligionSection.vue'
import ParishionerHouseholdMembersSection from '@/features/register-parishioner/components/form/ParishionerHouseholdMembersSection.vue'
import { useParishionerForm } from '@/features/register-parishioner/composables/use_parishioner_form'
import { useParishionerFormSubmission } from '@/features/register-parishioner/composables/use_parishioner_form_submission'
import ParishionerPersonalInfoSection from '@/features/register-parishioner/components/form/ParishionerPersonalInfoSection.vue'

const form = useParishionerForm()
const { isSubmitting, isValidating, meta } = form
const { onSubmit } = useParishionerFormSubmission(form)
</script>
