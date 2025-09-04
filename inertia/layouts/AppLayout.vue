<template>
  <Head>
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
  </Head>
  <div class="flex flex-col min-h-screen bg-background font-sans antialiased">
    <AppHeader />

    <main class="flex-1 min-w-0">
      <slot />
    </main>

    <AppFooter />

    <ScrollToTopButton />
    <Toaster richColors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ScrollToTopButton from '@/components/ScrollToTopButton.vue'
import { Head } from '@inertiajs/vue3'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: "Site officiel de l'Archidiocèse - Communauté catholique",
})
</script>
