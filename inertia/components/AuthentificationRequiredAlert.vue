<template>
  <Alert variant="info">
    <LogIn />
    <AlertDescription>
      <span>
        Vous devez vous
        <Link route="signIn" class="underline cursor-pointer"> connecter</Link>
        {{ props.text || 'pour utiliser cette fonctionnalité.' }}
      </span>
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn } from 'lucide-vue-next'
import { Link } from '@tuyau/inertia/vue'

type Props = {
  text?: string
}

const props = defineProps<Props>()
</script>
