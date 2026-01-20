<template>
  <Head title="Contact" />

  <PageBanner py="16">
    <Typography variant="h1" class="text-4xl md:text-5xl font-bold mb-4 font-serif">
      Nous Contacter
    </Typography>
    <p class="text-xl opacity-90">
      Nous sommes là pour vous. N'hésitez pas à nous appeler ou nous écrire pour poser vos questions
      et nous faire part de vos préoccupations et commentaires.
    </p>
  </PageBanner>

  <section class="container mx-auto px-4 py-12 lg:py-16">
    <div class="max-w-4xl mx-auto">
      <ContactSuccessAlert />
      <div class="grid md:grid-cols-2 gap-16">
        <div class="flex flex-col gap-4">
          <h2 class="text-2xl font-bold text-catholic-purple mb-6 font-serif">
            Envoyez-nous un message
          </h2>

          <AuthentificationRequiredAlert
            v-if="!user"
            text="pour utiliser le formulaire de contact."
          />
          <ContactForm v-else />
        </div>

        <ContactSidebar />
      </div>
    </div>
  </section>

  <ContactOurLocation />
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import AuthentificationRequiredAlert from '@/shared/components/AuthentificationRequiredAlert.vue'
import { useUser } from '@/shared/composables/use_user'
import { Typography } from '@/shared/components/ui/typography'
import ContactForm from '@/features/contact/components/form/ContactForm.vue'
import ContactSidebar from '@/features/contact/components/sidebar/ContactSidebar.vue'
import ContactOurLocation from '@/features/contact/components/our-location/ContactOurLocation.vue'
import ContactSuccessAlert from '@/features/contact/components/form/ContactSuccessAlert.vue'

const user = useUser()
</script>
