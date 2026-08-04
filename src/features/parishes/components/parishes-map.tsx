import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { parishes } from '#/config/parishes'
import { GTA5_OVERVIEW_CENTER, GTA5_OVERVIEW_ZOOM, GTA5Map } from '#/shared/components/map/gta5-map'
import type { MapMarkerHandle } from '#/shared/components/map/map-marker'
import MapMarker from '#/shared/components/map/map-marker'
import { getParishInfo } from '#/shared/constants/parish'
import type { ParishId } from '#/shared/types/parish.types'

type Props = {
  activeParishId: ParishId | null
  onSelectParish: (id: ParishId | null) => void
}

function MapFocus({
  activeParishId,
  markerRefs,
}: {
  activeParishId: ParishId | null
  markerRefs: RefObject<Partial<Record<ParishId, MapMarkerHandle | null>>>
}) {
  const map = useMap()

  useEffect(() => {
    const closeAllPopups = () => {
      Object.values(markerRefs.current).forEach((marker) => marker?.closePopup())
    }

    if (!activeParishId) {
      closeAllPopups()
      map.flyTo(GTA5_OVERVIEW_CENTER, GTA5_OVERVIEW_ZOOM, { animate: true, duration: 1 })
      return
    }

    const parish = getParishInfo(activeParishId)
    if (!parish?.coords) return

    closeAllPopups()
    map.flyTo(parish.coords, 5, { animate: true, duration: 1.2 })

    const timer = setTimeout(() => markerRefs.current[activeParishId]?.openPopup(), 650)
    return () => clearTimeout(timer)
  }, [activeParishId, map, markerRefs])

  return null
}

/**
 * Interactive Leaflet map of the GTA V world with one marker per parish.
 * Leaflet requires a browser DOM, so this module must only be loaded on the
 * client (see `ParishesExplorer`).
 */
export function ParishesMap({ activeParishId, onSelectParish }: Props) {
  const markerRefs = useRef<Partial<Record<ParishId, MapMarkerHandle | null>>>({})

  return (
    <GTA5Map>
      <MapFocus activeParishId={activeParishId} markerRefs={markerRefs} />
      {parishes.map((parish) =>
        parish.coords ? (
          <MapMarker
            key={parish.id}
            ref={(el) => {
              markerRefs.current[parish.id] = el
            }}
            variant="cross"
            position={parish.coords}
            active={activeParishId === parish.id}
            onClick={() => onSelectParish(activeParishId === parish.id ? null : parish.id)}
          >
            <MapPopup parishId={parish.id} />
          </MapMarker>
        ) : null
      )}
    </GTA5Map>
  )
}

function MapPopup({ parishId }: { parishId: ParishId }) {
  const parish = getParishInfo(parishId)

  return (
    <div className="min-w-44 space-y-1.5">
      <p className="leading-snug font-semibold">{parish?.title}</p>
      {parish?.pastor && (
        <p className="text-xs text-muted-foreground">
          {parish.pastorOffice ?? 'Curé'} : {parish.pastor}
        </p>
      )}
    </div>
  )
}
