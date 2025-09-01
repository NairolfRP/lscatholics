<template>
  <Button variant="ghost" :alt="characterName" class="cursor-pointer"
    ><User class="size-lg laptop:size-sm" />
    <span class="block lg:hidden laptop:block">{{ characterName }}</span></Button
  >
</template>

<script lang="ts" setup>
import { User } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { useUser } from '@/composables/use_user'

const user = useUser()

const characterName = computed(() => {
  const currentCharacter = user.value?.currentCharacter
  const fullName = `${currentCharacter?.firstname} ${currentCharacter?.lastname}`
  return fullName.length > 15 ? fullName.slice(0, 15) + '...' : fullName
})
</script>
