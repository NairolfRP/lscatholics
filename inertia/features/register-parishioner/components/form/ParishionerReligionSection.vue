<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <Church class="w-5 h-5" />
      Paroisse et religion
    </h3>
    <div class="grid md:grid-cols-2 gap-4">
      <FormField v-slot="{ componentField }" name="baptized">
        <FormItem>
          <div class="space-y-2">
            <FormLabel>Êtes-vous baptisé ? *</FormLabel>
            <Select v-bind="componentField" required>
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez une réponse" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in [
                    { id: 'yes', label: 'Oui' },
                    { id: 'no', label: 'Non' },
                    { id: 'unsure', label: 'Je ne suis pas sûr' },
                  ]"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="religion">
        <FormItem>
          <div class="space-y-2">
            <FormLabel>Religion *</FormLabel>
            <Select v-bind="componentField" required>
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez une réponse" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="religion in CATHOLIC_OR_OTHER"
                  :key="religion.id"
                  :value="religion.id"
                >
                  {{ religion.label }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="parish">
        <FormItem>
          <div class="space-y-2">
            <FormLabel>Paroisse *</FormLabel>
            <Select v-bind="componentField" required>
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Sélectionnez une paroisse" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem v-for="parish in parishes" :key="parish.id" :value="parish.id">
                  {{ parish.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Indiquez une paroisse de l'archidiocèse. En général, on indique la paroisse la plus
              proche de son domicile.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATHOLIC_OR_OTHER } from '#shared/constants/person.constants'
import { parishes } from '@/shared/constants/parishes.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Church } from 'lucide-vue-next'
</script>
