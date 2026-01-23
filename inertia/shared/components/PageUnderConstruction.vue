<template>
  <Head :title="pageTitle" />
  <PageBanner align="text-left">
    <h1 class="text-4xl text-white font-bold">{{ pageTitle }}</h1>
  </PageBanner>

  <section class="py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <Alert variant="info">
        <Construction />
        <AlertTitle>Pas encore disponible</AlertTitle>
        <AlertDescription>
          Cette page est en cours de construction... Revenez par ici très bientôt !
        </AlertDescription>
      </Alert>
    </div>
  </section>
</template>
<script lang="ts" setup>
import Head from '@/shared/components/AppHead.vue'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Construction } from 'lucide-vue-next'

type Props = {
  pageTitle: string
}
defineProps<Props>()
</script>
