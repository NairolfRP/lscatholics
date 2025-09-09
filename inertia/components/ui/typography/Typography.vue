<script setup lang="ts">
import {
  typographyTags,
  typographyVariants,
  type TypographyVariants,
} from '@/components/ui/typography/index'
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?: TypographyVariants['variant']
  class?: HTMLAttributes['class']
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'p',
})

const tag = computed(() => {
  if (props.as) {
    return props.as
  }

  return props.variant ? typographyTags[props.variant] : 'p'
})
</script>
<template>
  <component :is="tag" :class="cn(typographyVariants({ variant: props.variant }), props.class)">
    <slot />
  </component>
</template>
