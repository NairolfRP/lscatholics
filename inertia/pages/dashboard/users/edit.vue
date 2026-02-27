<template>
  <Head :title="`Modifier l'utilisateur ${itemUser.name}`" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_users.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Modifier l'utilisateur</h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ itemUser.name }}
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Détails</CardTitle>
            <CardDescription> Modifiez les paramètres de l'utilisateur </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <form id="dashboard-edit-user-form" @submit.prevent="onSubmit">
              <FieldGroup>
                <Field>
                  <FieldLabel>Nom d'utilisateur GTAW</FieldLabel>
                  <FieldDescription>{{ itemUser.name }}</FieldDescription>
                </Field>

                <Field :data-invalid="!!form.errors.roles">
                  <FieldContent>
                    <FieldLabel for="roles">Rôles</FieldLabel>
                    <FieldDescription>
                      Assigner des rôles ou en retirer à l'utilisateur. Vous ne pouvez sélectionner
                      que ceux qui sont inférieurs à vos rôles.
                    </FieldDescription>
                    <FieldError v-if="form.errors.roles" :errors="[form.errors.roles]" />
                  </FieldContent>
                  <Select
                    :model-value="form.roles"
                    @update:model-value="
                      (v) => {
                        if (!Array.isArray(v)) return
                        form.roles = v
                      }
                    "
                    multiple
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assigner des rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="role in rolesList"
                        :key="role.id"
                        :value="role.id"
                        :disabled="role.hierarchyOrder <= editorHighestRole.hierarchyOrder"
                      >
                        {{ role.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
      <div class="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Enregistrer</CardTitle>
            <CardContent class="space-y-4"> </CardContent>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="flex gap-2">
              <Button
                form="dashboard-edit-user-form"
                type="submit"
                :disabled="form.processing"
                class="flex-1"
              >
                Mettre à jour
              </Button>
              <Button type="button" variant="outline" as-child>
                <Link :href="urlFor('dashboard.dashboard_users.index')"> Annuler </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import { Head, Link, useForm } from '@inertiajs/vue3'
import { urlFor } from '@/client'
import { ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

type PageProps = InertiaProps<{
  itemUser: Data.Users.User.Variants['withRoles']
  rolesList: Data.Roles.Role.Variants['minimalDetails'][]
  editorHighestRole: Data.Roles.Role.Variants['minimalDetails']
}>

const props = defineProps<PageProps>()

const form = useForm({
  roles: props.itemUser.roles.map((r) => r.id) || [],
})

const onSubmit = () => {
  form.put(urlFor('dashboard.dashboard_users.update', { id: props.itemUser.id }))
}
</script>
