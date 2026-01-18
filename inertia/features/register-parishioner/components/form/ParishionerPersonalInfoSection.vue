<template>
  <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
    <Users class="w-5 h-5" />
    Informations personnelles
  </h3>
  <FormField v-slot="{ componentField }" name="civilTitle">
    <FormItem>
      <div class="space-y-2">
        <FormLabel>Titre de civilité *</FormLabel>
        <Select v-bind="componentField" required>
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionnez un titre de civilité" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="cTitle of CIVIL_TITLES" :value="cTitle.id">
                {{ cTitle.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>

  <FormField v-slot="{ componentField }" name="maritalStatus">
    <FormItem>
      <div class="space-y-2">
        <FormLabel>État matrimonial *</FormLabel>
        <Select v-bind="componentField" required>
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionnez un état matrimonial" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="mStatus of MARITAL_STATUS" :value="mStatus.id">
                {{ mStatus.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>

  <div class="grid md:grid-cols-2 gap-4">
    <FormField v-slot="{ componentField }" name="firstname" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>Prénom *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" required placeholder="John" />
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="lastname" :validate-on-blur="!isFieldDirty">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>Nom de famille *</FormLabel>
          <FormControl>
            <Input v-bind="componentField" required placeholder="Doe" />
          </FormControl>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="gender">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>Sexe *</FormLabel>
          <Select v-bind="componentField" required>
            <FormControl>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Sélectionnez un genre" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="gender of GENDERS" :value="gender.id">
                  {{ gender.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ value, setValue }" name="age">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>Âge *</FormLabel>
          <NumberField
            id="age"
            :min="16"
            :max="120"
            :model-value="value ?? null"
            @update:model-value="
              (v) => {
                if (v) {
                  setValue(v)
                } else {
                  setValue(undefined)
                }
              }
            "
            required
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <FormControl>
                <NumberFieldInput />
              </FormControl>
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
  </div>

  <FormField v-slot="{ componentField }" name="ethnicCommunity">
    <FormItem>
      <div class="space-y-2">
        <FormLabel>Êtes-vous membre d'une communauté ethnique spécifique ?</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Sélectionner une communauté" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="community of LOCAL_ETHNICS_COMMUNITIES" :value="community.id">
                {{ community.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>

  <FormField v-slot="{ componentField }" name="occupation" :validate-on-blur="!isFieldDirty">
    <FormItem>
      <div class="space-y-2">
        <FormLabel>Activité / Emploi</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="Votre activité ou travail" />
        </FormControl>
        <FormMessage />
      </div>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import { CIVIL_TITLES, GENDERS, MARITAL_STATUS } from '#shared/constants/person.constants'
import { LOCAL_ETHNICS_COMMUNITIES } from '#shared/constants/ethnicity.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { Users } from 'lucide-vue-next'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { Input } from '@/shared/components/ui/input'
import { useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

const { isFieldDirty } = useFormContext<RegisterParishionerFormValues>()
</script>
