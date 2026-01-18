<template>
  <Transition
    name="scroll-button"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-0 right-0 pb-3 pr-5 z-50"
      role="region"
      aria-label="Scroll to top"
    >
      <Button
        @click="scrollToTop"
        :disabled="isScrolling"
        class="transition-colors duration-200 shadow-lg"
        variant="default"
        size="icon"
        aria-label="Scroll back to top of page"
        tabindex="0"
      >
        <ChevronUp class="size-4" />
        <span class="sr-only">Back to top</span>
      </Button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/shared/components/ui/button'
import { ChevronUp } from 'lucide-vue-next'
import { useEventListener, useThrottleFn } from '@vueuse/core'

const SCROLL_THRESHOLD = 200
const THROTTLE_DELAY = 100
const SCROLL_DURATION = 800

const scrollY = ref(0)
const isScrolling = ref(false)

const isVisible = computed(() => scrollY.value > SCROLL_THRESHOLD)

const handleScroll = useThrottleFn(() => {
  scrollY.value = window.scrollY
}, THROTTLE_DELAY)

const scrollToTop = async () => {
  if (isScrolling.value) return

  isScrolling.value = true

  try {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    await new Promise<void>((resolve) => {
      if (prefersReducedMotion) {
        window.scrollTo({ top: 0 })
        resolve()
      } else {
        const startY = window.scrollY
        const startTime = performance.now()

        const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / SCROLL_DURATION, 1)
          const easedProgress = easeOutCubic(progress)

          window.scrollTo(0, startY * (1 - easedProgress))

          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          } else {
            resolve()
          }
        }

        requestAnimationFrame(animateScroll)
      }
    })
  } catch (error) {
    console.warn('Scroll to top animation failed:', error)
    window.scrollTo({ top: 0 })
  } finally {
    isScrolling.value = false
  }
}

onMounted(() => {
  useEventListener(window, 'scroll', handleScroll, { passive: true })
  useEventListener(document, 'keydown', (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Home') {
      event.preventDefault()
      scrollToTop()
    }
  })
})
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .scroll-button-enter-active,
  .scroll-button-leave-active {
    transition: none !important;
  }
}
</style>
