<script setup lang="ts">
import { Head } from '@inertiajs/vue3'

defineProps<{ error: any }>()
</script>

<template>
  <Head title="Error 404" />

  <div class="my-60 text-center">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Server Error</h1>
    <p class="text-xl opacity-90">{{ error?.message }}</p>
  </div>
</template>
