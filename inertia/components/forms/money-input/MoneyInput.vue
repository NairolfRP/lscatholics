<template>
  <FormField v-slot="{ value }" :name="name">
    <FormItem>
      <FormLabel v-if="props.label" class="text-sm font-medium text-gray-700 mb-3 block">
        {{ props.label }}
      </FormLabel>

      <div class="mt-1" v-if="showCustomField">
        <div class="flex justify-between">
          <NumberField
            :min="minAmount"
            :max="maxAmount"
            :format-options="currencyFormat"
            :model-value="value"
            class="w-full"
            @update:model-value="handleAmountChange"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <FormControl>
                <NumberFieldInput />
              </FormControl>
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <Button
            variant="ghost"
            class="px-2 cursor-pointer hover:bg-transparent"
            size="icon"
            @click="showCustomField = false"
          >
            <CircleX class="size-6 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <div v-else class="grid gap-2 mb-4" :class="gridClass">
        <Button
          v-for="prefAmount in props.predefinedAmounts"
          :key="prefAmount"
          variant="outline"
          :class="cn({ [selectedClass]: prefAmount === value })"
          @click="() => setFieldValue('amount', prefAmount)"
        >
          {{ formatCurrency(prefAmount) }}
        </Button>
        <Button variant="outline" @click="showCustomField = true"> Autre </Button>
      </div>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { CircleX } from 'lucide-vue-next'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { computed, ref } from 'vue'
import { useFormContext } from 'vee-validate'
import { cn } from '@/lib/utils'

type Props = {
  name: string
  label?: string
  predefinedAmounts?: number[]
  minAmount?: number
  maxAmount?: number
  currency?: string
  locale?: string
  selectedClass?: string
  gridCols?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Montant',
  predefinedAmounts: () => [100000, 50000, 20000, 10000, 5000],
  minAmount: 0,
  maxAmount: undefined,
  currency: 'USD',
  locale: 'fr-FR',
  selectedClass: 'bg-blue-50 border-blue-500 text-blue-700',
  gridCols: 4,
})

const { setFieldValue } = useFormContext()

const showCustomField = ref<boolean>(false)

const currencyFormat = computed(
  (): Intl.NumberFormatOptions => ({
    style: 'currency',
    currency: props.currency,
    currencyDisplay: 'code',
    currencySign: 'accounting',
  })
)

const gridClass = computed(() => {
  const base = 'grid-cols-2 sm:grid-cols-'
  return base + props.gridCols
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    currencyDisplay: 'symbol',
    maximumSignificantDigits: 2,
  })
    .format(amount)
    .replace('US', '')
    .trim()
}

const handleAmountChange = (v: number | undefined) => {
  if (v) {
    setFieldValue(props.name, v)
  } else {
    setFieldValue(props.name, 0)
  }
}
</script>
