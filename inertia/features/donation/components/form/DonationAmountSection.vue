<template>
  <MoneyInput
    name="amount"
    label="Montant du don"
    :predefined-amounts="predefinedAmounts"
    currency="USD"
    locale="fr-FR"
  />
</template>

<script setup lang="ts">
import { MoneyInput } from '@/shared/components/forms/money-input'

interface Props {
  predefinedAmounts: number[]
}

defineProps<Props>()
</script>
