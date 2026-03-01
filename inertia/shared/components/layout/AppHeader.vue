<template>
  <header
    :class="
      cn(
        'fixed top-0 left-0 right-0 z-99 text-primary-foreground pt-safe pl-safe pr-safe transition-all duration-500 ease-in-out',
        {
          'bg-catholic-purple/70 backdrop-blur-md shadow-md': isScrolled,
          'bg-transparent': !isScrolled,
        }
      )
    "
  >
    <div
      :class="
        cn(
          'absolute top-0 left-0 w-full h-30 bg-linear-to-b from-black/50 to-transparent -z-10 transition-opacity duration-500',
          { 'opacity-0': isScrolled, 'opacity-100': !isScrolled }
        )
      "
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
import { Link } from '@adonisjs/inertia/vue'
import AppNavigation from '@/shared/components/layout/Navigation/AppNavigation.vue'
import AppMobileMenu from '@/shared/components/layout/Navigation/AppMobileMenu.vue'
import UserAccountMenu from '@/shared/components/auth/UserAccountMenu.vue'
import LoginButton from '@/shared/components/auth/LoginButton.vue'
import { useUser } from '@/shared/composables/use_user'
import { cn } from '@/lib/utils'
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'

const user = useUser()

const SCROLL_THRESHOLD = 50
const { y } = useWindowScroll()
const isScrolled = computed(() => y.value > SCROLL_THRESHOLD)
</script>
