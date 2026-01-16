<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<template>
  <div v-if="isMounted">
    <slot />
  </div>
  <div v-else>
    <slot name="fallback" />
  </div>
</template>
