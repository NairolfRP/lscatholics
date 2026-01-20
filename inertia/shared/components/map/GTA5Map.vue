<template>
  <div :class="cn('w-full h-screen relative', $attrs.class as string)">
    <div ref="mapContainer" class="h-full w-full bg-inherit"></div>
    <slot v-if="mapInstance" />
  </div>
</template>
<script setup lang="ts">
import { cn } from '@/lib/utils'
import L, { type LatLngExpression, type LatLngTuple, Map, type TileLayerOptions } from 'leaflet'
import { onBeforeUnmount, onMounted, provide, ref, shallowRef } from 'vue'
import 'leaflet/dist/leaflet.css'
import { CustomCRS } from '@/shared/components/map/custom_crs'

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
    minZoom: 1,
    maxZoom: 5,
    preferCanvas: true,
    center: props.center,
    zoom: props.zoom,
    attributionControl: true,
  })

  map.attributionControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a> | GTA V Map')
  const southWest = map.unproject([0, 8192], map.getMaxZoom())
  const northEast = map.unproject([8192, 0], map.getMaxZoom())
  map.setMaxBounds(new L.LatLngBounds(southWest, northEast))

  const commonOptions: TileLayerOptions = {
    keepBuffer: 64,
    bounds: new L.LatLngBounds(
      map.unproject([0, 8192], map.getMaxZoom()),
      map.unproject([8192, 0], map.getMaxZoom())
    ),
    noWrap: true,
    minZoom: 0,
    maxZoom: 5,
  }

  const atlas = L.tileLayer('/map/assets/map-tiles/atlas/{z}/{x}/{y}.jpg', commonOptions)
  const satellite = L.tileLayer('/map/assets/map-tiles/satelite/{z}/{x}/{y}.jpg', commonOptions)

  const baseMaps = {
    Atlas: atlas,
    Satellite: satellite,
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
