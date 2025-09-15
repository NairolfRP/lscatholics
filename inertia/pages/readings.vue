<template>
  <section class="container max-w-4xl mx-auto my-40 space-y-10 px-5">
    <Typography variant="h1"> Lectures du jour </Typography>

    <div v-if="data?.informations" class="space-y-1 mt-2">
      <div class="flex items-center space-x-2">
        <span
          class="w-4 h-4 rounded-sm border border-gray-600"
          :style="{ backgroundColor: liturgicalColor(liturgicalHeader?.couleur || '') }"
        ></span>
        <span class="text-gray-700 font-bold">
          {{ liturgicalHeader?.dateInfo.weekday }}, {{ liturgicalHeader?.dateInfo.semaine || '' }} —
          Année {{ liturgicalHeader?.dateInfo.annee }}
        </span>
      </div>

      <div v-if="liturgicalHeader?.subFeast" class="flex items-center space-x-2">
        <span
          v-if="liturgicalHeader?.couleur2"
          class="w-4 h-4 rounded-sm border shadow"
          :style="{ backgroundColor: liturgicalColor(liturgicalHeader?.couleur2 || '') }"
        ></span>
        <span class="text-gray-700">{{ liturgicalHeader?.subFeast }}</span>
      </div>

      <div v-if="liturgicalHeader?.subDegree" class="text-gray-500">
        {{ liturgicalHeader?.subDegree }}
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span class="ml-4 text-gray-600">Chargement des lectures...</span>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600 font-medium">Erreur lors du chargement des lectures</p>
      <p class="text-red-500 text-sm mt-2">{{ error.message }}</p>
      <Button @click="refetch" variant="destructive" class="mt-4"> Réessayer </Button>
    </div>

    <div v-else-if="data" class="space-y-8">
      <template v-if="data.messes.length > 1">
        <div v-for="(mass, index) in data.messes" :key="index" class="space-y-4">
          <h2 class="text-2xl font-bold text-blue-700">{{ mass.nom }}</h2>
          <div
            v-for="lecture in sortReadings(mass.lectures)"
            :key="lecture.type"
            class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
              <h3
                v-if="getReadingTypeLabel(lecture.type)"
                class="text-xl font-semibold mb-4 text-blue-800"
              >
                {{ getReadingTypeLabel(lecture.type) }}
              </h3>
              <h4 v-if="lecture.titre" class="text-base font-semibold italic text-blue-500">
                {{ lecture.titre }}
              </h4>
              <p class="text-blue-600 text-sm mt-1">{{ lecture.ref }}</p>
            </div>
            <div class="p-6">
              <div
                v-html="formatText(lecture.contenu)"
                class="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="lecture in sortReadings(data.messes[0].lectures)"
          :key="lecture.type"
          class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        >
          <div class="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <h3
              v-if="getReadingTypeLabel(lecture.type)"
              class="text-xl font-semibold mb-4 text-blue-800"
            >
              {{ getReadingTypeLabel(lecture.type) }}
            </h3>
            <h4 class="text-base font-semibold italic text-blue-500">{{ lecture.titre }}</h4>
            <p class="text-blue-600 text-sm text-right mt-1">{{ lecture.ref }}</p>
          </div>
          <div class="p-6">
            <p v-if="lecture.refrain_psalmique" class="mb-4">
              <strong>R/</strong> {{ ' ' }}
              <span
                v-html="
                  formatText(lecture.refrain_psalmique.replace('<p>', '').replace('</p>', ''))
                "
              />
            </p>
            <div v-if="lecture.verset_evangile" v-html="formatText(lecture.verset_evangile)" />
            <div
              v-html="formatText(lecture.contenu)"
              class="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            />
          </div>
        </div>
      </template>

      <div
        v-if="data.messes.length === 0 || data.messes[0].lectures.length === 0"
        class="text-center py-12"
      >
        <p class="text-gray-500">Aucune lecture disponible pour aujourd'hui.</p>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Typography } from '@/components/ui/typography'
import { useQuery } from '@tanstack/vue-query'
import { Button } from '@/components/ui/button'
import { computed } from 'vue'
import { formatDate } from '@vueuse/core'
import { getReadingTypeLabel, liturgicalColor } from '@/services/liturgy'

interface ReadingsMetadata {
  date: string
  zone: string
  couleur: string
  annee: string
  temps_liturgique: string
  semaine: string
  jour: string
  jour_liturgique_nom: string
  fete: string
  degre: string
  ligne1: string
  ligne2: string
  ligne3: string
  couleur2: string | null
  couleur3: string | null
}

interface Reading {
  type: string
  refrain_psalmique: string | null
  ref_refrain: string | null
  titre: string | null
  contenu: string
  ref: string
  intro_lue: string | null
  verset_evangile: string | null
  ref_verset: string | null
}

interface Mass {
  nom: string
  lectures: Reading[]
}

interface Response {
  informations: ReadingsMetadata
  messes: Mass[]
}

const { isLoading, data, error, refetch } = useQuery({
  queryKey: ['daily-readings', new Date().toDateString()],
  queryFn: async (): Promise<Response> => {
    const today = new Date().toISOString().split('T')[0]
    const response = await fetch(`https://api.aelf.org/v1/messes/${today}`)
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`)
    }
    return response.json()
  },
  staleTime: 1000 * 60 * 30,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})

const sortReadings = (readings: Reading[]): Reading[] => {
  const readingOrder = ['lecture_1', 'psaume', 'lecture_2', 'evangile']

  return readingOrder
    .map((v) => {
      const reading = readings.find((r) => r.type === v)
      if (!reading) return null
      return { ...reading }
    })
    .filter(Boolean) as Reading[]
}

const getLiturgicalHeader = (info: ReadingsMetadata) => {
  const mainName = info.jour_liturgique_nom || info.ligne1 || ''
  const subFeast = info.fete && info.fete !== mainName ? info.fete : null
  const subDegree =
    info.ligne3 ||
    (info.degre && info.degre !== mainName && info.degre !== info.fete ? info.degre : null)
  return {
    mainName,
    subFeast,
    subDegree,
    couleur: info.couleur,
    couleur2: info.couleur2,
    dateInfo: {
      weekday: info.date ? formatDate(new Date(info.date), 'dddd', { locales: 'fr-FR' }) : '',
      semaine: info.semaine,
      annee: info.annee,
    },
  }
}

const liturgicalHeader = computed(() =>
  data.value ? getLiturgicalHeader(data.value.informations) : null
)

const formatText = (text: string): string => {
  if (!text) return ''

  return text
    .replace(/<p>/g, '<p class="mb-4">')
    .replace(/R\//g, '<strong class="text-blue-600">R/ </strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
}
</script>
