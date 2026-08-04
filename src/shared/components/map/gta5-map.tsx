import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import type { HTMLAttributes, PropsWithChildren } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { LayersControl, MapContainer, useMap } from 'react-leaflet'
import { cn } from '#/shared/lib/utils'
import { createGta5Crs } from './custom-crs'
import { Gta5TileLayer } from './tile-layer'

export type GTA5MapHandle = {
  flyTo: (coords: LatLngExpression, zoom?: number, duration?: number) => void
}

/** Center/zoom framing the whole Los Santos map area. */
export const GTA5_OVERVIEW_CENTER: [number, number] = [-357, -375]
export const GTA5_OVERVIEW_ZOOM = 3

type Props = PropsWithChildren<{
  center?: LatLngExpression
  zoom?: number
  className?: HTMLAttributes<HTMLElement>['className']
}>

function Gta5ZoomControl() {
  const map = useMap()

  useEffect(() => {
    const control = L.control.zoom({ position: 'topleft' })
    control.addTo(map)
    return () => {
      control.remove()
    }
  }, [map])

  return null
}

export const GTA5Map = forwardRef<GTA5MapHandle, Props>(function GTA5Map(
  { children, center = GTA5_OVERVIEW_CENTER, zoom = GTA5_OVERVIEW_ZOOM, className },
  ref
) {
  const mapRef = useRef<L.Map | null>(null)

  useImperativeHandle(ref, () => ({
    flyTo: (coords: LatLngExpression, flyZoom = 5, duration = 1.2) => {
      mapRef.current?.flyTo(coords, flyZoom, { animate: true, duration })
    },
  }))

  return (
    <div
      className={cn(
        'gta5-map relative h-full w-full overflow-hidden rounded-2xl bg-[#0f1115] shadow-sm ring-1 ring-foreground/10',
        className
      )}
    >
      <MapContainer
        ref={mapRef}
        crs={createGta5Crs()}
        minZoom={1}
        maxZoom={5}
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full"
        preferCanvas
      >
        <LayersControl position="topright" collapsed={false}>
          <LayersControl.BaseLayer name="Atlas">
            <Gta5TileLayer url="/map/assets/map-tiles/atlas/{z}/{x}/{y}.jpg" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite" checked>
            <Gta5TileLayer url="/map/assets/map-tiles/satelite/{z}/{x}/{y}.jpg" />
          </LayersControl.BaseLayer>
        </LayersControl>

        <Gta5ZoomControl />

        {children}
      </MapContainer>
    </div>
  )
})

export default GTA5Map
