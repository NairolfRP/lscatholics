<template>
  <ContactPage />
</template>
<script setup lang="ts">
import ContactPage from '@/features/contact/components/ContactPage.vue'
import type { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'

type PageProps = {
  subjects: typeof CONTACT_SUBJECTS
}

defineProps<PageProps>()
</script>
