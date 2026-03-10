import { forwardRef, PropsWithChildren, useImperativeHandle, useRef } from 'react'
import L, { type LatLngExpression } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

type Props = PropsWithChildren<{
  position: LatLngExpression
}>

export interface MapMarkerHandle {
  openPopup: () => void
}

const customIcon = L.icon({
  iconRetinaUrl: '/map/assets/marker-icon-2x.png',
  iconUrl: '/map/assets/marker-icon.png',
  shadowUrl: '/map/assets/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
})

const MapMarker = forwardRef(({ children, position }: Props, ref) => {
  const markerRef = useRef<L.Marker>(null)

  useImperativeHandle(ref, () => ({
    openPopup: () => markerRef.current?.openPopup(),
  }))

  return (
    <Marker ref={markerRef} position={position} icon={customIcon}>
      {children && (
        <Popup>
          <>{children}</>
        </Popup>
      )}
    </Marker>
  )
})

export default MapMarker
