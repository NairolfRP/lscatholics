<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>(( Changer de personnage ))</DialogTitle>
        <DialogDescription>
          Choisissez quel personnage vous souhaitez utiliser comme personnage actuel sur le site. Il
          vous permettra d'interragir avec des fonctionnalités en son nom.
        </DialogDescription>
      </DialogHeader>

      <div v-if="loading" class="flex justify-center py-4">
        <LoaderCircle class="animate-spin size-6" />
      </div>

      <Alert v-else-if="error" variant="destructive" class="my-4">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          {{ error }}
          <Button @click="fetchCharacters" variant="outline" size="sm" class="ml-2 mx-auto">
            Réessayer
          </Button>
        </AlertDescription>
      </Alert>

      <form
        v-else-if="characters.length"
        @submit.prevent="handleSwitchCharacter(selectedCharacterId)"
        class="grid items-start gap-4 px-4"
      >
        <RadioGroup class="flex flex-col gap-6 mb-5" v-model="selectedCharacterId">
          <div v-for="character in characters" class="flex items-center space-x-2">
            <RadioGroupItem :id="`${character.id}`" :value="character.id" />
            <Label :for="`${character.id}`">
              {{ character.firstname }} {{ character.lastname }}
            </Label>
          </div>
        </RadioGroup>
        <Button type="submit" :disabled="selectedCharacterId === undefined"
          >Sélectionner le personnage</Button
        >
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { GTAWorldCharacter } from '@gtaw-oauth-providers/adonisjs-ally'
import { computed, ref, watch } from 'vue'
import { tuyau } from '@/lib/tuyau'
import { LoaderCircle } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUser } from '@/composables/use_user'
import { router } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import { useErrors } from '@/composables/use_errors'

type Props = {
  open?: boolean
}

type Emits = {
  (e: 'update:open', value: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const user = useUser()
const errors = useErrors()

const loading = ref<boolean>(false)
const error = ref<string | null>(null)
const characters = ref<GTAWorldCharacter[]>([])

const selectedCharacterId = ref<number>()

const currentChracterId = computed(() => user.value!.currentCharacter!.id)

const handleSwitchCharacter = (characterId: number | undefined) => {
  if (characterId === undefined) {
    return
  }

  router.patch(
    tuyau.$url('switchCharacter'),
    { characterId },
    {
      preserveScroll: true,
      preserveState: true,
      onSuccess(page) {
        toast.success(page.props.success as string)
        selectedCharacterId.value = undefined
        router.reload()
        emit('update:open', false)
      },
    }
  )
}

const fetchCharacters = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await fetch(tuyau.$url('listCharacters'), {
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })

    if (!response.ok) {
      throw new Error('Network Error')
    }

    const data = (await response.json()) as {
      data: GTAWorldCharacter[]
      success: boolean
      error?: string
    }

    characters.value = data?.data.filter((char) => char.id !== currentChracterId.value) || []
  } catch {
    error.value = 'Une erreur est survenue lors du chargement des personnages.'
  } finally {
    loading.value = false
  }
}

watch(
  () => errors,
  (err) => {
    if (err.value.E_SWITCH_CHARACTER) {
      toast.error(err.value.E_SWITCH_CHARACTER)
    }
  }
)

watch(
  () => props.open,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      fetchCharacters()
      selectedCharacterId.value = undefined
    }
  }
)
</script>
