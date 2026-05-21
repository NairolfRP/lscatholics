import { type RefObject } from 'react'
import { GTA5Map, type GTA5MapHandle } from '@/shared/components/map/gta5-map'
import MapMarker, { type MapMarkerHandle } from '@/shared/components/map/map-marker'
import { parishes } from '@/shared/constants/parishes.constants'

type Props = {
  mapRef: RefObject<GTA5MapHandle | null>
  markerRefs: RefObject<Array<MapMarkerHandle | null>>
}

export default function ParishesMap({ mapRef, markerRefs }: Props) {
  return (
    <GTA5Map
      ref={mapRef}
      center={[-709.148, -759.794]}
      zoom={3}
      className="h-[500px] rounded-xl border-2 border-catholic-gold shadow-xl"
    >
      {parishes.map((parish, index) => (
        <MapMarker
          key={parish.id}
          ref={(el: MapMarkerHandle | null) => {
            markerRefs.current[index] = el
          }}
          position={parish.coords}
        >
          <div className="p-2">
            <h4 className="font-bold">{parish.name}</h4>
          </div>
        </MapMarker>
      ))}
    </GTA5Map>
  )
}
