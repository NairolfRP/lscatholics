<template>
  <Head title="Faire un don" :image="DonateHero" />

  <PageBanner :bg-image="DonateHero" align="text-left">
    <Typography variant="h1" class="text-4xl md:text-5xl font-bold mb-4 font-serif">
      Soutenir notre communauté
    </Typography>
  </PageBanner>

  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <DonationHeader />

    <div class="grid lg:grid-cols-2 gap-8">
      <DonationTabs />
      <DonationSidebar />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Head } from '@inertiajs/vue3'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import DonateHero from '@/assets/images/donate-background.png'
import { Typography } from '@/shared/components/ui/typography'
import DonationHeader from '@/features/donation/components/DonationHeader.vue'
import DonationTabs from '@/features/donation/components/DonationTabs.vue'
import DonationSidebar from '@/features/donation/components/sidebar/DonationSidebar.vue'
</script>
