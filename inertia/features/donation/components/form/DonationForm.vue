<template>
  <Card class="p-6">
    <CardHeader>
      <CardTitle class="text-2xl font-semibold text-gray-900"> Faire un don </CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <form id="donation-form" @submit="onSubmit">
        <FieldGroup>
          <DonationAmountSection :predefined-amounts="predefinedAmounts" />

          <div class="space-y-4 pt-4 border-t">
            <DonationPersonalInfoSection />
            <DonationAddressSection />
          </div>

          <DonationOptionsSection />
        </FieldGroup>
      </form>
    </CardContent>

    <CardFooter class="pt-6">
      <DonationSubmitButton :is-submitting="isSubmitting" :amount="values.amount" />
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useDonationForm } from '@/features/donation/composables/use_donation_form'
import DonationAmountSection from '@/features/donation/components/form/DonationAmountSection.vue'
import DonationPersonalInfoSection from '@/features/donation/components/form/DonationPersonalInfoSection.vue'
import DonationAddressSection from '@/features/donation/components/form/DonationAddressSection.vue'
import DonationOptionsSection from '@/features/donation/components/form/DonationOptionsSection.vue'
import DonationSubmitButton from '@/features/donation/components/form/DonationSubmitButton.vue'
import { useDonationSubmit } from '@/features/donation/composables/use_donation_submit'
import { usePaymentPopup } from '@/features/donation/composables/use_payment_popup'
import { FieldGroup } from '@/shared/components/ui/field'

const { handleSubmit, isSubmitting, values, predefinedAmounts, setErrors, resetForm } =
  useDonationForm()
const { openPayment } = usePaymentPopup()
const { submitDonation } = useDonationSubmit(setErrors, resetForm)

const onSubmit = handleSubmit((formValues) => {
  submitDonation(formValues, openPayment)
})
</script>
