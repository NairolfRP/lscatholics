<template>
  <Alert variant="info">
    <LogIn />
    <AlertDescription>
      <span>
        Vous devez vous
        <LinkText :href="tuyau.$url('signIn')" class="text-info-foreground" external
          >connecter</LinkText
        >
        {{ props.text || 'pour utiliser cette fonctionnalité.' }}
      </span>
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { LogIn } from 'lucide-vue-next'
import { LinkText } from '@/shared/components/ui/LinkText'
import { tuyau } from '@/lib/tuyau'

type Props = {
  text?: string
}

const props = defineProps<Props>()
</script>
