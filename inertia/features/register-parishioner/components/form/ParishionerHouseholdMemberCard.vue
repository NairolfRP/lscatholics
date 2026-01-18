<template>
  <Card class="relative">
    <CardContent class="pt-6">
      <div class="absolute top-4 right-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          @click="$emit('remove')"
          class="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <span class="sr-only">Supprimer</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </Button>
      </div>

      <div class="grid md:grid-cols-2 gap-4 pr-10">
        <FormField v-slot="{ componentField }" :name="`familyMembers[${index}].firstname`">
          <FormItem>
            <div class="space-y-2">
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" required placeholder="Prénom" />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :name="`familyMembers[${index}].lastname`">
          <FormItem>
            <div class="space-y-2">
              <FormLabel>Nom de famille *</FormLabel>
              <FormControl>
                <Input v-bind="componentField" required placeholder="Nom de famille" />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :name="`familyMembers[${index}].age`">
          <FormItem>
            <div class="space-y-2">
              <FormLabel>Âge *</FormLabel>
              <FormControl>
                <Input
                  v-bind="componentField"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Âge"
                  required
                />
              </FormControl>
              <FormMessage />
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" :name="`familyMembers[${index}].role`">
          <FormItem>
            <div class="space-y-2">
              <FormLabel>Rôle dans le foyer *</FormLabel>
              <Select v-bind="componentField" required>
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="role in HOUSEHOLD_ROLES" :key="role.id" :value="role.id">
                    {{ role.label }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </div>
          </FormItem>
        </FormField>
      </div>

      <FormField
        v-slot="{ value, handleChange }"
        type="checkbox"
        :name="`familyMembers[${index}].isNpc`"
      >
        <FormItem class="flex flex-row items-center gap-x-2 mt-2">
          <FormControl>
            <Checkbox :model-value="value" @update:model-value="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel class="inline text-sm">
              (( C'est un personnage non-joueur (PNJ) ))
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { HOUSEHOLD_ROLES } from '#shared/constants/person.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'

defineProps<{ index: number }>()
defineEmits<{ remove: [] }>()
</script>
