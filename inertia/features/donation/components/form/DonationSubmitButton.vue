<template>
  <Button type="submit" :disabled="isSubmitting" class="w-full">
    Donner {{ formattedAmount }}
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/shared/components/ui/button'
import { computed } from 'vue'

interface Props {
  isSubmitting: boolean
  amount: number | undefined
}

const props = defineProps<Props>()

const formattedAmount = computed(() => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  })
    .format(props.amount || 0)
    .replace('US', '')
    .trim()
})
</script>
