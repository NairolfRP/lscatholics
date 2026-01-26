<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Informations sur le foyer</h3>
    <VeeFieldArray v-slot="{ fields, push, remove }" name="familyMembers">
      <FieldSet class="gap-4">
        <FieldLegend>Membres du foyer</FieldLegend>
        <FieldDescription>
          Ajoutez les membres de votre foyer qui s'inscriront avec vous (conjoint, enfants, etc.)
        </FieldDescription>
        <FieldGroup class="gap-4">
          <Empty
            v-if="fields?.length === 0"
            class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg"
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users />
              </EmptyMedia>
              <EmptyTitle>Aucun membre du foyer ajouté</EmptyTitle>
              <EmptyDescription> Cliquez sur "Ajouter un membre" pour commencer </EmptyDescription>
            </EmptyHeader>
          </Empty>

          <div v-else class="space-y-4">
            <ParishionerHouseholdMemberCard
              v-for="(entry, idx) in fields"
              :key="entry.key"
              :index="idx"
              @remove="remove(idx)"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="default"
            :disabled="fields.length >= 5"
            @click="addMember(push)"
            class="w-full gap-2"
          >
            <Users class="w-4 h-4" />
            Ajouter un membre du foyer
          </Button>
        </FieldGroup>
        <ErrorMessage
          id="familyMembersError"
          data-slot="form-message"
          as="p"
          :name="toValue('familyMembers')"
          class="text-destructive text-sm"
        />
      </FieldSet>
    </VeeFieldArray>
  </div>
</template>

<script setup lang="ts">
import { toValue } from 'vue'
import { Button } from '@/shared/components/ui/button'
import { Users } from 'lucide-vue-next'
import { ErrorMessage, FieldArray as VeeFieldArray } from 'vee-validate'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty'
import ParishionerHouseholdMemberCard from '@/features/register-parishioner/components/form/ParishionerHouseholdMemberCard.vue'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/shared/components/ui/field'

const addMember = (push: (value: unknown) => void) => {
  push({
    firstname: '',
    lastname: '',
    age: 0,
    role: undefined,
    isNpc: false,
  })
}
</script>
