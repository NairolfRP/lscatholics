<template>
  <Alert
    v-if="props.success || errors.CONTACT_ERROR"
    :variant="props.success ? 'success' : 'destructive'"
    role="alert"
    :aria-live="props.success ? 'polite' : 'assertive'"
    class="mb-8"
  >
    <component :is="props.success ? CheckCircle : AlertTriangle" class="size-6" />
    <AlertTitle>{{ props.success ? 'Confirmation' : 'Erreur' }}</AlertTitle>
    <AlertDescription>{{ props.success ? props.success : errors.CONTACT_ERROR }}</AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { AlertTriangle, CheckCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { usePageProps } from '@/shared/composables/use_page_props'
import { useErrors } from '@/shared/composables/use_errors'

const props = usePageProps()
const errors = useErrors()
</script>
