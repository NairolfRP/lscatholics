<template>
  <Link
    v-if="route"
    :route="route"
    :params="routeParams"
    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
  >
    <div class="text-sm font-medium leading-none group-hover:text-catholic-gold transition-colors">
      {{ title }}
    </div>
    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
      <slot />
    </p>
  </Link>

  <a
    v-else
    :href="href || '#'"
    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
  >
    <div class="text-sm font-medium leading-none group-hover:text-catholic-gold transition-colors">
      {{ title }}
    </div>
    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
      <slot />
    </p>
  </a>
</template>

<script setup lang="ts">
import { Link } from '@tuyau/inertia/vue'

interface Props {
  route?: string
  routeParams?: Record<string, any>
  href?: string
  title: string
}

defineProps<Props>()
</script>
