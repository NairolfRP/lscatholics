<template>
  <Head title="S'enregistrer comme paroissien" />

  <ParishionerBanner />

  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <ParishionerBenefits />

    <Card class="shadow-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Formulaire d'enregistrement comme paroissien</CardTitle>
        <CardDescription>
          Veuilez remplir les informations ci-dessous pour enregistrer votre foyer comme
          paroissiens.<br /><br />

          <span class="font-bold">
            Seuls les champs indiqués avec un astérisque (*) sont obligatoires.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthentificationRequiredAlert v-if="!user" text="pour enregistrer votre foyer en ligne." />
        <ParishionerForm v-else />
      </CardContent>
    </Card>

    <div class="mt-8 text-center text-sm text-muted-foreground">
      <p>
        Vos informations resteront confidentielles et ne seront utilisées que pour la correspondance
        et les services des paroisses.
      </p>
      <p class="mt-2">Des questions ? <LinkText route="contact">Contactez-nous</LinkText></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Head from '@/shared/components/AppHead.vue'
import ParishionerBanner from '@/features/register-parishioner/components/ParishionerBanner.vue'
import ParishionerBenefits from '@/features/register-parishioner/components/ParishionerBenefits.vue'
import AuthentificationRequiredAlert from '@/shared/components/AuthentificationRequiredAlert.vue'
import { LinkText } from '@/shared/components/ui/LinkText'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { useUser } from '@/shared/composables/use_user'
import ParishionerForm from '@/features/register-parishioner/components/form/ParishionerForm.vue'

const user = useUser()
</script>
