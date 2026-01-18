<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar Desktop -->
    <aside
      class="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white dark:bg-gray-800 hidden lg:block"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center border-b px-6">
          <Link :href="tuyau.$url('home')" class="flex items-center gap-2">
            <span class="text-xl font-bold">LS Catholics</span>
          </Link>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-1 px-3 py-4">
          <Link
            v-for="item in menuItems"
            :key="item.route"
            :href="tuyau.$has(item.route) ? tuyau.$url(item.route as any) : '#'"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="[
              tuyau.$current(item.route + '*')
                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50',
            ]"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </Link>
        </nav>

        <!-- User Menu -->
        <div class="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" class="w-full justify-start gap-3 px-3">
                <Avatar class="h-8 w-8">
                  <AvatarFallback>{{ userInitials }}</AvatarFallback>
                </Avatar>
                <div class="flex flex-col items-start text-sm">
                  <span class="font-medium">{{ user!.name }}</span>
                  <!-- <span class="text-xs text-gray-500">{{ user.email }}</span> -->
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <Link :href="tuyau.$url('profile')">
                  <Settings class="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <Link :href="tuyau.$url('logout')" method="post" class="text-destructive">
                  <LogOut class="mr-2 h-4 w-4 text-inherit" />
                  Déconnexion
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header
      class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:hidden dark:bg-gray-800"
    >
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="ghost" size="icon">
            <Menu class="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" class="w-64 p-0">
          <div class="flex h-full flex-col">
            <div class="flex h-16 items-center border-b px-6">
              <Link :href="tuyau.$url('home')" class="flex items-center gap-2">
                <span class="text-xl font-bold">LS Catholics</span>
              </Link>
            </div>
            <nav class="flex-1 space-y-1 px-3 py-4">
              <Link
                v-for="item in menuItems"
                :key="item.route"
                :href="tuyau.$has(item.route) ? tuyau.$url(item.route as any) : '#'"
                class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                :class="[
                  tuyau.$current(item.route + '*')
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                <component :is="item.icon" class="h-5 w-5" />
                {{ item.label }}
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <span class="text-lg font-semibold">Dashboard</span>
    </header>

    <!-- Main Content -->
    <main class="lg:pl-64">
      <div class="p-6 lg:p-8">
        <slot />
      </div>
    </main>
  </div>

  <ScrollToTopButton />
  <Toaster richColors />
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import { Link } from '@inertiajs/vue3'
import { Calendar, FileText, LayoutDashboard, LogOut, Menu, Settings, Users } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/shared/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { tuyau } from '@/lib/tuyau'
import { useUser } from '@/shared/composables/use_user'
import { usePageProps } from '@/shared/composables/use_page_props'
import { toast } from 'vue-sonner'
import { Toaster } from '@/shared/components/ui/sonner'
import ScrollToTopButton from '@/shared/components/ScrollToTopButton.vue'

const user = useUser()
const pageProps = usePageProps()

const hasPermission = (permission: string) => {
  return (pageProps.value.permissions as string[]).some((p) => p === permission)
}

const menuItems = computed(() =>
  [
    {
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      route: 'dashboard.index' as const,
      permission: 'dashboardAccess',
    },
    {
      label: 'Articles',
      icon: FileText,
      route: 'dashboard.dashboard_articles.index' as const,
      permission: 'viewArticles',
    },
    {
      label: 'Événements',
      icon: Calendar,
      route: 'dashboard.dashboard_events.index' as const,
      permission: 'manageEvents',
    },
    {
      label: 'Utilisateurs',
      icon: Users,
      route: 'dashboard.dashboard_users.index' as const,
      permission: 'manageUsers',
    },
  ].filter((item) => !item.permission || hasPermission(item.permission))
)

const userInitials = computed(() => {
  const names = user.value!.name!.split(' ')
  return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0]
})

const success = computed(() => pageProps.value.success)

watch(success, (message) => {
  toast.success(message)
})
</script>
