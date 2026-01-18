<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { AlertVariants } from '@/shared/components/ui/alert/index'
import { alertVariants } from '@/shared/components/ui/alert/index'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  variant?: AlertVariants['variant']
}>()
</script>

<template>
  <div data-slot="alert" :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <slot />
  </div>
</template>
