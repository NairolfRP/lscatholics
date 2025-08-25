<template>
  <div class="flex flex-col min-h-screen bg-background font-sans antialiased">
    <AppHeader />

    <main class="flex-1 min-w-0">
      <slot />
    </main>

    <AppFooter />
    <Toaster richColors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: "Site officiel de l'Archidiocèse - Communauté catholique",
})
</script>
