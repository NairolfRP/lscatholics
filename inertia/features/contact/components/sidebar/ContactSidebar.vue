<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-catholic-purple mb-6 font-serif">
        Informations de contact
      </h2>

      <Card class="p-6">
        <CardContent class="space-y-6">
          <div class="flex items-start gap-4">
            <div
              class="size-10 bg-catholic-gold text-white rounded-full flex items-center justify-center flex-shrink-0"
            >
              <MapPin class="size-5" />
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-1">
                Tour de la Cathédrale Notre-Dame-des-Saints
              </h3>
              <p class="text-gray-600">
                Ginger street, Little Seoul<br />
                Los Santos, SA 90010<br />
                États-Unis
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div
              class="size-10 bg-catholic-purple text-white rounded-full flex items-center justify-center flex-shrink-0"
            >
              <Phone class="size-5" />
            </div>
            <div>
              <h3 class="font-semibold text-lg mb-1">Téléphone</h3>
              <p class="text-gray-600">
                Accueil: 700<br />
                Urgences: 700
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="bg-red-50 border-red-200">
      <CardContent class="p-6">
        <div class="flex items-start gap-3">
          <AlertTriangle class="size-6 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 class="font-semibold text-red-800 mb-2">Contact d'urgence</h3>
            <p class="text-red-700 text-sm mb-3">
              Pour les situations d'urgence spirituelle (derniers sacrements, extrême-onction,
              confession urgente), contactez notre ligne 24h/24.
            </p>
            <Button
              variant="outline"
              size="sm"
              class="border-red-300 text-red-700 hover:bg-red-100"
            >
              <Phone class="size-4 mr-2" />
              700
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <div>
      <h3 class="font-semibold text-lg mb-4">Suivez-nous</h3>
      <div class="flex gap-3">
        <a
          v-for="social of ARCHDIOCESE_SOCIAL_MEDIAS.filter((s) => !s.isOOC && !s.footerOnly)"
          :href="social.url"
          :title="social.title"
          :class="
            cn(
              'size-10 text-white rounded-full flex items-center justify-center transition-colors',
              social.colorClasses
            )
          "
        >
          <component :is="social.icon" class="size-5" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ARCHDIOCESE_SOCIAL_MEDIAS } from '@/shared/constants/social.constants'
import { cn } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { AlertTriangle, MapPin, Phone } from 'lucide-vue-next'
</script>
