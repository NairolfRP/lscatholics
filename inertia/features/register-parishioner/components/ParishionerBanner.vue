<template>
  <PageBanner py="16">
    <Typography variant="h2" class="border-0 text-4xl font-bold mb-4 font-serif">
      Bienvenue chez vous !
    </Typography>
    <p class="text-xl opacity-90">
      Nous sommes ravis que vous vous intéressiez à rejoindre notre famille de familles.
      L'enregistrement aide les paroisses à mieux vous servir et vous permet de rester en contact
      avec elles.
    </p>
  </PageBanner>
</template>

<script setup lang="ts">
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Typography } from '@/shared/components/ui/typography'
</script>
