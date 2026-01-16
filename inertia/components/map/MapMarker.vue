<template>
  <div style="display: none">
    <div ref="popupContent">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, ref, type ShallowRef, useSlots, watch } from 'vue'
import type { LatLngExpression, Map, Marker } from 'leaflet'
import L from 'leaflet'

const props = defineProps<{
  position: LatLngExpression
}>()

const customIcon = L.icon({
  iconRetinaUrl: '/assets/map/marker-icon-2x.png',
  iconUrl: '/assets/map/marker-icon.png',
  shadowUrl: '/assets/map/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

const mapInstance = inject<ShallowRef<Map | null>>('mapInstance')
const popupContent = ref<HTMLElement | null>(null)
const slots = useSlots()
let marker: Marker | null = null

const addMarkerToMap = () => {
  if (!mapInstance?.value || marker) return

  marker = L.marker(props.position, { icon: customIcon }).addTo(mapInstance.value)

  if (slots.default) {
    marker.bindPopup(() => {
      if (popupContent.value) {
        popupContent.value.style.display = 'block'
        return popupContent.value
      }
      return ''
    })
  }
}

onMounted(() => {
  addMarkerToMap()
})

watch(
  () => mapInstance?.value,
  (newMap) => {
    if (newMap) {
      addMarkerToMap()
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (marker) marker.remove()
})
</script>
