<template>
  <AppHead />
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
import { Toaster } from '@/shared/components/ui/sonner'
import 'vue-sonner/style.css'
import AppHeader from '@/shared/components/layout/AppHeader.vue'
import AppFooter from '@/shared/components/layout/AppFooter.vue'
import ScrollToTopButton from '@/shared/components/ScrollToTopButton.vue'
import AppHead from '@/shared/components/AppHead.vue'

interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: "Site officiel de l'Archidiocèse - Communauté catholique",
})
</script>
