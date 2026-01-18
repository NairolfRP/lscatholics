<template>
  <header class="fixed top-0 left-0 right-0 z-99 text-primary-foreground">
    <div
      class="absolute top-0 left-0 w-full h-30 bg-gradient-to-b from-black/50 to-transparent -z-10"
    ></div>
    <div class="flex w-full justify-between align-middle items-center lg:py-5 lg:px-10">
      <h1>
        <Link route="home">
          <img alt="Logo" :src="Logo" class="w-20 h-20" />
        </Link>
      </h1>

      <div class="flex lg:gap-4 items-center px-5 lg:p-0">
        <AppNavigation />

        <UserAccountMenu v-if="user" />
        <LoginButton v-else />

        <AppMobileMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Logo from '@/assets/images/logo.png'
import { Link } from '@tuyau/inertia/vue'
import AppNavigation from '@/shared/components/layout/Navigation/AppNavigation.vue'
import AppMobileMenu from '@/shared/components/layout/Navigation/AppMobileMenu.vue'
import UserAccountMenu from '@/shared/components/auth/UserAccountMenu.vue'
import LoginButton from '@/shared/components/auth/LoginButton.vue'
import { useUser } from '@/shared/composables/use_user'

const user = useUser()
</script>
