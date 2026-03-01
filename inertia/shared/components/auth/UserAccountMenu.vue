<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" :alt="characterName" class="cursor-pointer">
        <User class="size-lg laptop:size-sm" />
        <span class="block lg:hidden laptop:block">{{ characterName }}</span>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56 mr-10 z-99">
      <DropdownMenuLabel>Mon compte - {{ user!.name }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <template v-if="user!.canAccessDashboard">
        <DropdownMenuGroup>
          <DropdownMenuItem @click="handleMenuAction('dashboard')">
            <Lock />
            <span>Tableau de bord</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </template>
      <DropdownMenuGroup>
        <DropdownMenuItem @click="openSwitchCharacter">
          <ArrowRightLeft />
          <span>Changer de personnage</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="handleMenuAction('settings')">
          <Settings />
          <span>Paramètres</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="handleMenuAction('logout')" class="text-destructive font-medium">
          <LogOut />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>

  <SwitchCharacter v-model:open="isSwitchCharacterOpen" />
</template>

<script lang="ts" setup>
import { ArrowRightLeft, Lock, LogOut, Settings, User } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { computed, ref } from 'vue'
import { useUser } from '@/shared/composables/use_user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { urlFor } from '@/client'
import { router } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import SwitchCharacter from '@/shared/components/SwitchCharacter.vue'

const user = useUser()

const isSwitchCharacterOpen = ref(false)

const characterName = computed(() => {
  const currentCharacter = user.value?.currentCharacter
  const fullName = `${currentCharacter?.firstname} ${currentCharacter?.lastname}`
  return fullName.length > 15 ? fullName.slice(0, 15) + '...' : fullName
})

const openSwitchCharacter = () => {
  isSwitchCharacterOpen.value = true
}

const handleMenuAction = (action: string) => {
  switch (action) {
    case 'dashboard':
      router.visit(urlFor('dashboard.index'))
      break
    case 'settings':
      router.visit(urlFor('profile'))
      break
    case 'logout':
      router.post(urlFor('logout'), undefined, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Déconnecté avec succès. A très bientôt !')
        },
        onError: (err) => {
          toast.error(err.E_LOGOUT, {
            duration: 10_000,
          })
        },
      })
      break
  }
}
</script>
