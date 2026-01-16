<template>
  <div :class="cn('w-full h-screen relative', $attrs.class as string)">
    <div ref="mapContainer" class="h-full w-full bg-inherit"></div>
    <slot v-if="mapInstance" />
  </div>
</template>
<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { LatLngExpression, LatLngTuple, Map } from 'leaflet'
import L from 'leaflet'
import { onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue'
import 'leaflet/dist/leaflet.css'
import { CustomCRS } from '@/components/map/custom_crs'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    center?: LatLngExpression
    zoom?: number
  }>(),
  {
    center: () => [0, 0] as LatLngTuple,
    zoom: 3,
  }
)

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = shallowRef<Map | null>(null)

const flyTo = (coords: LatLngExpression, zoom?: number) => {
  if (mapInstance.value) {
    mapInstance.value.flyTo(coords, zoom || 5, {
      duration: 1.5,
      easeLinearity: 0.25,
    })
  }
}

provide('mapInstance', mapInstance)

defineExpose({ flyTo })

onMounted(() => {
  if (!mapContainer.value) return

  const map = L.map(mapContainer.value, {
    crs: CustomCRS,
    minZoom: 3,
    maxZoom: 5,
    preferCanvas: true,
    center: props.center,
    zoom: props.zoom,
    attributionControl: false,
  })

  const commonOptions = {
    keepBuffer: 64,
    noWrap: true,
    minZoom: 0,
    maxZoom: 5,
  }

  const atlas = L.tileLayer('/assets/map/map-tiles/atlas/{z}/{x}/{y}.jpg', commonOptions)
  const satellite = L.tileLayer('/assets/map/map-tiles/satelite/{z}/{x}/{y}.jpg', commonOptions)
  const grid = L.tileLayer('/assets/map/map-tiles/grid/{z}/{x}/{y}.png', commonOptions)

  const baseMaps = {
    Atlas: atlas,
    Satellite: satellite,
    Grille: grid,
  }

  L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map)

  satellite.addTo(map)

  mapInstance.value = map
})

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove()
  }
})
</script>
