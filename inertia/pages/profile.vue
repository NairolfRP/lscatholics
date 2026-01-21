<template>
  <Head :title="user!.name" />
  <section class="container max-w-4xl mx-auto my-40 space-y-10 px-5">
    <Typography variant="h1">Mes paramètres</Typography>

    <DiscordConnection />

    <DangerZone />
  </section>
</template>
<script setup lang="ts">
import Head from '@/shared/components/AppHead.vue'
import { useUser } from '@/shared/composables/use_user'
import { Typography } from '@/shared/components/ui/typography'
import DangerZone from '@/features/profile/components/DangerZone.vue'
import DiscordConnection from '@/features/profile/components/DiscordConnection.vue'

const user = useUser()
</script>
