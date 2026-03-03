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
import { watch } from 'vue'
import { toast } from 'vue-sonner'
import { usePage } from '@inertiajs/vue3'
import { Data } from '@generated/data'

interface Props {
  title?: string
  description?: string
}

const page = usePage<Data.SharedProps>()

withDefaults(defineProps<Props>(), {
  title: '',
  description: "Site officiel de l'Archidiocèse - Communauté catholique",
})

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash.error,
  (error) => {
    if (error) toast.error(error)
  },
  { immediate: true }
)
</script>
