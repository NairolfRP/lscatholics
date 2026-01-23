<template>
  <Head title="Nos Paroisses" />

  <PageBanner bg-color="bg-linear-to-r from-catholic-purple to-catholic-blue" py="16">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Nos Paroisses</h1>
    <p class="text-xl opacity-90">
      Découvrez les communautés de foi qui composent notre archidiocèse
    </p>
  </PageBanner>

  <section class="py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <Typography variant="h2" class="pb-10 text-catholic-purple font-bold">
        Doyenné Notre-Dame-des-Saints
      </Typography>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          v-for="(parish, index) in parishes"
          :key="parish.id"
          @click="focusParish(index)"
          class="card-hover cursor-pointer transition-all hover:ring-2 hover-ring-catholic-gold pt-0"
        >
          <div
            v-if="parish.image"
            class="aspect-video bg-cover bg-center"
            :style="`background-image: url(${parish.image})`"
          ></div>
          <div v-else class="aspect-video bg-gray-200 rounded-t-lg"></div>
          <CardContent class="p-6">
            <h3 class="font-bold text-xl mb-2 text-catholic-purple">{{ parish.name }}</h3>
            <div class="flex items-start gap-2 mb-3 text-sm text-gray-600">
              <MapPin class="w-4 h-4 mt-0.5 shrink-0" />
              <span>{{ parish.address }}</span>
            </div>

            <p v-if="parish?.description" class="text-base text-justify leading-7 py-2">
              {{ parish.description }}
            </p>

            <div class="mb-4">
              <h4 class="inline font-semibold mb-2 text-sm">{{ parish.priestOffice }} :</h4>
              <div class="inline ml-2 space-y-1 text-xs">
                {{ parish.priestName }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref="mapScrollTarget" class="mt-12">
        <ClientOnly>
          <GTA5Map
            ref="mapRef"
            :center="[-709.148, -759.794]"
            :zoom="0"
            class="h-[500px] rounded-xl border-2 border-catholic-gold shadow-xl"
          >
            <MapMarker
              v-for="(parish, index) in parishes"
              :key="parish.id"
              :ref="(el) => (markerRefs[index] = el as any)"
              :position="parish.coords"
              :variant="parish.isCathedral ? 'cathedral' : 'parish'"
            >
              <div class="p-2">
                <h4 class="font-bold">{{ parish.name }}</h4>
              </div>
            </MapMarker>
          </GTA5Map>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Card, CardContent } from '@/shared/components/ui/card'
import Head from '@/shared/components/AppHead.vue'
import { MapPin } from 'lucide-vue-next'
import { parishes } from '@/shared/constants/parishes.constants'
import { Typography } from '@/shared/components/ui/typography'
import ClientOnly from '@/shared/components/ClientOnly.vue'
import { ref, defineAsyncComponent } from 'vue'

const GTA5Map = defineAsyncComponent(() => import('@/shared/components/map/GTA5Map.vue'))
const MapMarker = defineAsyncComponent(() => import('@/shared/components/map/MapMarker.vue'))

const mapScrollTarget = ref<HTMLElement | null>(null)
const mapRef = ref<{ flyTo: (coords: [number, number], zoom?: number) => void } | null>(null)
const markerRefs = ref<Array<{ openPopup: () => void } | null>>([])

const focusParish = (index: number) => {
  const parish = parishes[index]

  if (mapScrollTarget.value) {
    mapScrollTarget.value.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  if (mapRef.value) {
    mapRef.value.flyTo(parish.coords as [number, number], 5)
  }

  setTimeout(() => {
    const marker = markerRefs.value[index]
    if (marker) {
      marker.openPopup()
    }
  }, 600)
}
</script>
