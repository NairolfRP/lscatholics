<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">(( Partie OOC ))</h3>
    <p class="text-sm text-gray-600">
      Cette partie est avant tout pour nous, pour avoir des informations sur vos personnages qu'en
      tant qu'Église nous sommes censés posséder.
    </p>

    <FormField v-slot="{ componentField }" name="characterSacraments">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>Votre personnage a reçu les sacrements de...</FormLabel>
          <Select v-bind="componentField" multiple>
            <FormControl>
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Sélectionnez des sacrements" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem
                v-for="sacrament in INDIVIDUAL_SACRAMENTS"
                :key="sacrament.id"
                :value="sacrament.id"
                :disabled="isCharacterSacramentDisabled(sacrament)"
              >
                {{ sacrament.label }}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormDescription class="text-muted-foreground text-xs">
            <p>
              Cochez ce que votre personnage a bien reçu dans son histoire passée. Ça nous permet de
              jouer nos archives et registres !
            </p>
            <Typography variant="list" class="mt-0">
              <li>
                Baptême : si votre personnage a été baptisé dans son histoire passée (par ex, quand
                il était enfant)
              </li>
              <li>
                Première communion : si votre personnage baptisé a fait sa première communion dans
                son histoire passée
              </li>
              <li>
                Confirmation : si votre personnage a reçu le sacrement de la confirmation dans son
                histoire passée (au début de l'adolescence ou plus tard)
              </li>
            </Typography>
          </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="oocAdditionalInformation">
      <FormItem>
        <div class="space-y-2">
          <FormLabel>
            Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP sur votre
            personnage ?
          </FormLabel>
          <FormControl>
            <Textarea v-bind="componentField" :max="700" rows="3" />
          </FormControl>
          <FormDescription class="text-muted-foreground text-sm">
            Laissez vide si rien ou si vous ne souhaitez pas partager d'informations. Soumettez
            uniquement des informations qui devraient déjà être sues en RP par le clergé de
            l'archidiocèse de Los Santos.
          </FormDescription>
          <FormMessage />
        </div>
      </FormItem>
    </FormField>
  </div>
</template>

<script setup lang="ts">
import { INDIVIDUAL_SACRAMENTS, type IndividualSacrament } from '#shared/constants/person.constants'
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
import { Textarea } from '@/shared/components/ui/textarea'
import { Typography } from '@/shared/components/ui/typography'
import { useFormContext } from 'vee-validate'
import type { RegisterParishionerFormValues } from '@/features/register-parishioner/types/parishioner_form.types'

const form = useFormContext<RegisterParishionerFormValues>()

const isCharacterSacramentDisabled = (sacrament: IndividualSacrament) => {
  const selected = form.values.characterSacraments || []
  const missingRequired =
    sacrament.required.length > 0 && !sacrament.required.every((req) => selected.includes(req))
  const isRequiredByOther = selected.some((selectedId) => {
    const selectedSacrament = INDIVIDUAL_SACRAMENTS.find((s) => s.id === selectedId)
    return selectedSacrament?.required.includes(sacrament.id)
  })
  return (!selected.includes(sacrament.id) && missingRequired) || isRequiredByOther
}
</script>
