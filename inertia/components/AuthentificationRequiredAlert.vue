<template>
  <Alert variant="info">
    <LogIn />
    <AlertDescription>
      <span>
        Vous devez vous
        <LinkText route="signIn" class="text-info-foreground">connecter</LinkText>
        {{ props.text || 'pour utiliser cette fonctionnalité.' }}
      </span>
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogIn } from 'lucide-vue-next'
import { LinkText } from '@/components/ui/LinkText'

type Props = {
  text?: string
}

const props = defineProps<Props>()
</script>
