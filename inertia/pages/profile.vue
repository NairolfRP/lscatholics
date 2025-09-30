<template>
  <Head :title="user!.name" />
  <section class="container max-w-4xl mx-auto my-40 space-y-10 px-5">
    <Typography variant="h1">Mes paramètres</Typography>
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
            <form id="deleteUserForm" @submit.prevent="form.delete(tuyau.$url('deleteUser'))">
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
  </section>
</template>
<script setup lang="ts">
import Head from '@/components/AppHead.vue'
import { useUser } from '@/composables/use_user'
import { Trash, TriangleAlert } from 'lucide-vue-next'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { useForm } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import { Input } from '@/components/ui/input'
import { watch } from 'vue'
import { useErrors } from '@/composables/use_errors'
import { toast } from 'vue-sonner'
import { Typography } from '@/components/ui/typography'

const user = useUser()

const errors = useErrors()

const form = useForm({
  username: '',
})

watch(errors, (err) => {
  if (err?.E_DELETE_USER) {
    toast.error(err.E_DELETE_USER)
  }
})
</script>
