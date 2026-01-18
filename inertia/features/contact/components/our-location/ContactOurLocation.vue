<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-catholic-purple mb-8 text-center font-serif">
        Nous trouver
      </h2>

      <GTA5Map class="aspect-video rounded-lg w-full" :center="[-685.58, -765.889]" :zoom="5">
        <MapMarker :position="[-685.58, -765.889]">
          <div class="p-2">
            <h4 class="font-bold">Tour de la Cathédrale Notre-Dame-des-Saints</h4>
            Ginger Street, Little Seoul<br />
            Los Santos, SA 90010
          </div>
        </MapMarker>
      </GTA5Map>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const GTA5Map = defineAsyncComponent(() => import('@/shared/components/map/GTA5Map.vue'))
const MapMarker = defineAsyncComponent(() => import('@/shared/components/map/MapMarker.vue'))
</script>
