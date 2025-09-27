<template>
  <!-- Information Sidebar -->
  <div class="space-y-6">
    <!-- Tax Information -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle class="text-xl font-semibold text-gray-900"> Informations fiscales </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-gray-600 text-sm">
          L'Archidiocèse de Los Santos est une organisation religieuse sans but lucratif. Vos dons
          sont déductibles d'impôts, conformément aux lois fédérales, étatiques et locales
          applicables.
        </p>
      </CardContent>
    </Card>

    <!-- Impact Information -->
    <Card class="p-6">
      <CardHeader>
        <CardTitle class="text-xl font-semibold text-gray-900"> Votre impact </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-blue-600 text-sm">🏠</span>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Soutien communautaire</h4>
            <p class="text-sm text-gray-600">Soutenir les familles et les personnes démunies</p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-yellow-600 text-sm">⛪</span>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Patrimoine</h4>
            <p class="text-sm text-gray-600">
              Restauration et conservation de monuments et du patrimoine religieux
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-green-600 text-sm">📚</span>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Éducation</h4>
            <p class="text-sm text-gray-600">
              Financement des établissements d'enseignement et des programmes de formation
              catholiques
            </p>
          </div>
        </div>

        <div class="flex items-start space-x-3">
          <div
            class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span class="text-purple-600 text-sm">✝️</span>
          </div>
          <div>
            <h4 class="font-medium text-gray-900">Ministères paroissiaux</h4>
            <p class="text-sm text-gray-600">
              Soutien à la mission de l'Église, à la liturgie, à la musique et aux programmes
              spirituels
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>
