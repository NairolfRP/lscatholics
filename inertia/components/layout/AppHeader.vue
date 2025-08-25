<template>
  <header class="fixed top-0 left-0 right-0 z-99 text-primary-foreground">
    <div
      class="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black/50 to-transparent -z-10"
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
import AppNavigation from '@/components/layout/Navigation/AppNavigation.vue'
import AppMobileMenu from '@/components/layout/Navigation/AppMobileMenu.vue'
import UserAccountMenu from '@/components/auth/UserAccountMenu.vue'
import LoginButton from '@/components/auth/LoginButton.vue'
import { usePage } from '@inertiajs/vue3'
import { computed } from 'vue'

const page = usePage()

const user = computed(() => page.props?.auth?.user)
</script>
