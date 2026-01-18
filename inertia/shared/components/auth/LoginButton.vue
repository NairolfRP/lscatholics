<template>
  <a :href="tuyau.$url('signIn')">
    <Button
      variant="ghost"
      aria-label="Se connecter"
      class="uppercase text-sm lg:text-xs xl:text-base"
    >
      <LogIn class="size-6 lg:size-4 xl:size-5" />
      <span class="lg:hidden laptop:block">Connexion</span>
    </Button>
  </a>
</template>

<script lang="ts" setup>
import { Button } from '@/shared/components/ui/button'
import { LogIn } from 'lucide-vue-next'
import { tuyau } from '@/lib/tuyau'
</script>
