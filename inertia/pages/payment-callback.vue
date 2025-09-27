<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
      <div v-if="success" class="space-y-4">
        <div class="text-6xl">🎉</div>
        <h2 class="text-2xl font-bold text-green-600">{{ title }}</h2>
        <p class="text-gray-600">{{ message }}</p>
        <div class="text-sm text-gray-500">
          Fermeture automatique dans <span class="font-mono">{{ countdown }}</span
          >s...
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="text-6xl">❌</div>
        <h2 class="text-2xl font-bold text-red-600">{{ title }}</h2>
        <p class="text-gray-600">{{ error }}</p>
        <div class="text-sm text-gray-500">
          Fermeture automatique dans <span class="font-mono">{{ countdown }}</span
          >s...
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'

type Props = {
  success?: boolean
  title: string
  message: string
  error?: string
  amount: number
  source: string
  metadata: Record<string, any>
}

const props = defineProps<Props>()

const countdown = ref(3)

onMounted(() => {
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      closePopup()
    }
  }, 1000)

  if (window.opener && window.opener !== window) {
    sendMessageToParent()
  }
})

const sendMessageToParent = () => {
  const messageData = props.success
    ? {
        type: 'PAYMENT_SUCCESS',
        title: props.title,
        message: props.message,
        amount: props.amount,
        source: props.source,
        metadata: props.metadata,
      }
    : {
        type: 'PAYMENT_ERROR',
        title: props.title,
        message: props.error,
      }

  window.opener.postMessage(messageData, window.location.origin)
}

const closePopup = () => {
  if (window.opener && window.opener !== window) {
    window.close()
  } else {
    window.location.href = '/'
  }
}
</script>
