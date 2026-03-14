import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'
import { cn } from '@/lib/utils'
import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react'
import { LayersControl, MapContainer } from 'react-leaflet'
import { CustomCRS } from '@/shared/components/map/custom_crs'
import { TileLayerWrapper } from '@/shared/components/map/title-layer-wrapper'
import type { MapRef } from 'react-leaflet/MapContainer'

type Props = PropsWithChildren<{
  ref?: RefObject<MapRef>
  center?: LatLngExpression
  zoom?: number
  className?: HTMLAttributes<HTMLElement>['className']
}>

export interface GTA5MapHandle {
  flyTo: (coords: LatLngExpression, flyZoom?: number, flyDuration?: number) => void
}

const commonOptions = {
  keepBuffer: 64,
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
}

export const GTA5Map = forwardRef(
  ({ children, center = [0, 0], zoom = 3, className }: Props, ref) => {
    const mapInstanceRef = useRef<MapRef>(null)

    useImperativeHandle(ref, () => ({
      flyTo: (coords: LatLngExpression, flyZoom: number = 5, flyDuration: number = 1.2) => {
        mapInstanceRef.current?.flyTo(coords, flyZoom, {
          animate: true,
          duration: flyDuration,
        })
      },
    }))

    return (
      <div className={cn('w-full h-screen relative', className)}>
        <MapContainer
          ref={mapInstanceRef}
          crs={CustomCRS()}
          minZoom={1}
          maxZoom={5}
          center={center}
          zoom={zoom}
          className="h-full w-full bg-inherit"
          preferCanvas
          attributionControl
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="Atlas">
              <TileLayerWrapper
                url="/map/assets/map-tiles/atlas/{z}/{x}/{y}.jpg"
                {...commonOptions}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite" checked>
              <TileLayerWrapper
                url="/map/assets/map-tiles/satelite/{z}/{x}/{y}.jpg"
                {...commonOptions}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {children}
        </MapContainer>
      </div>
    )
  }
)

export default GTA5Map
