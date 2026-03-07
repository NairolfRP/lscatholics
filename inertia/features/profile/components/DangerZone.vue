<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-3 text-destructive">
        <Trash /> Danger Zone
      </CardTitle>
      <CardDescription>
        Toutes les informations et les données associées à votre compte seront définitivement et
        instantanément effacées. Avant de supprimer votre compte, veillez à sauvegarder toutes les
        informations que vous souhaitez conserver.
      </CardDescription>
    </CardHeader>
    <CardFooter class="flex justify-end">
      <Dialog>
        <DialogTrigger>
          <Button variant="destructive" class="cursor-pointer">
            <Trash class="mr-2" /> Supprimer mon compte
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr de vouloir supprimer votre compte ?</DialogTitle>
          </DialogHeader>
          <Alert variant="warning">
            <TriangleAlert />
            <AlertTitle>Cette action sera immédiate et irréversible.</AlertTitle>
          </Alert>
          <form id="deleteUserForm" @submit.prevent="form.delete(urlFor('deleteUser'))">
            <Input
              type="text"
              v-model="form.username"
              :placeholder="`Entrez ici « ${user!.name} » pour confirmer`"
            />
            <p v-if="form.errors.username" class="text-destructive text-sm mt-2">
              {{ form.errors.username }}
            </p>
          </form>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              class="w-full"
              form="deleteUserForm"
              :disabled="form.processing || form.username !== user!.name"
            >
              {{ form.processing ? 'Suppression du compte...' : 'Supprimer ce compte' }}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import { urlFor } from '@/client'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Trash, TriangleAlert } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { Alert, AlertTitle } from '@/shared/components/ui/alert'
import { Input } from '@/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { useUser } from '@/shared/composables/use_user'
import { useForm } from '@inertiajs/vue3'

const user = useUser()

const form = useForm({
  username: '',
})
</script>
