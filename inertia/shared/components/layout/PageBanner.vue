<template>
  <section
    class="flex relative z-1"
    :class="
      cn(...paddingClasses, height, textColor, {
        'bg-cover bg-center bg-no-repeat': bgImage,
        [bgColor]: !bgImage,
      })
    "
    :style="bgImage ? { backgroundImage: `url(${bgImage})` } : undefined"
  >
    <div v-if="bgImage && showOverlay" class="absolute inset-0" :class="overlayClass"></div>
    <div class="container mx-auto px-4 relative z-10" :class="[align, maxWidth]">
      <slot />
    </div>

    <div
      v-if="$slots.corner"
      class="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm hidden lg:block"
    >
      <slot name="corner" />
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  bgImage?: string
  bgColor?: string
  height?: string
  py?: string
  pt?: string

  align?: 'text-left' | 'text-center' | 'text-right'
  maxWidth?: 'max-w-2xl' | 'max-w-4xl' | 'max-w-6xl' | 'max-w-full'

  textColor?: 'text-white' | 'text-black' | 'text-gray-800'

  showOverlay?: boolean
  overlayColor?: 'black' | 'blue' | 'purple' | 'gray'
  overlayOpacity?: '10' | '20' | '30' | '40' | '50' | '60' | '70'
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: 'bg-gradient-to-r from-catholic-purple to-catholic-red',
  py: '24',
  pt: '45',
  align: 'text-center',
  maxWidth: 'max-w-4xl',
  textColor: 'text-white',
  showOverlay: true,
  overlayColor: 'black',
  overlayOpacity: '30',
})

const overlayClass = computed(() => {
  return `bg-${props.overlayColor}/${props.overlayOpacity}`
})

const paddingClasses = computed(() => {
  const classes = []

  const pyMap: Record<string, string> = {
    '16': 'py-16',
    '20': 'py-20',
    '24': 'py-24',
  }

  const ptMap: Record<string, string> = {
    '32': 'pt-32',
    '40': 'pt-40',
    '45': 'pt-45',
  }

  if (pyMap[props.py]) classes.push(pyMap[props.py])
  if (ptMap[props.pt]) classes.push(ptMap[props.pt])

  return classes
})
</script>
