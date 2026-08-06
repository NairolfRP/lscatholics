import type { LatLngExpression } from 'leaflet'
import type { ReactNode } from 'react'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

type MarkerVariant = 'default' | 'cross'

export type MapMarkerHandle = {
  openPopup: () => void
  closePopup: () => void
}

type Props = {
  position: LatLngExpression
  variant?: MarkerVariant
  active?: boolean
  onClick?: () => void
  children?: ReactNode
}

function parishPinHtml(active: boolean) {
  const pin = active ? 'var(--color-catholic-gold)' : '#ffffff'
  const pinStroke = active ? 'var(--color-catholic-red)' : 'rgba(0, 0, 0, 0.28)'
  const cross = active ? '#ffffff' : 'var(--color-catholic-purple)'

  return `
    <svg viewBox="0 0 28 36" width="28" height="36" aria-hidden="true">
      <path
        fill="${pin}"
        stroke="${pinStroke}"
        stroke-width="1.5"
        d="M14 0C6.8 0 1 5.8 1 13c0 9.8 13 22.6 13 22.6S27 22.8 27 13C27 5.8 21.2 0 14 0z"
      />
      <g transform="translate(14 14)">
        <path fill="${cross}" d="M-1.5 -8h3v5h3v3h-3v7h-3v-7h-3v-3h3z"/>
      </g>
    </svg>`
}

function createDefaultIcon(active: boolean) {
  return L.icon({
    iconRetinaUrl: '/map/assets/marker-icon-2x.png',
    iconUrl: '/map/assets/marker-icon.png',
    shadowUrl: '/map/assets/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
    className: active
      ? 'transition-[filter] duration-300 hue-rotate-[160deg] saturate-[300%] brightness-[1.2] drop-shadow-[0_0_6px_var(--color-catholic-gold)]'
      : 'transition-[filter] duration-300',
  })
}

function createParishIcon(active: boolean) {
  return L.divIcon({
    className: 'gta5-marker',
    html: parishPinHtml(active),
    iconSize: [28, 36],
    iconAnchor: [14, 35],
    popupAnchor: [0, -34],
  })
}

export const MapMarker = forwardRef<MapMarkerHandle, Props>(function MapMarker(
  { position, variant = 'default', active = false, onClick, children },
  ref
) {
  const markerRef = useRef<L.Marker | null>(null)
  const icon = useMemo(
    () => (variant === 'cross' ? createParishIcon(active) : createDefaultIcon(active)),
    [active, variant]
  )

  useImperativeHandle(ref, () => ({
    openPopup: () => markerRef.current?.openPopup(),
    closePopup: () => markerRef.current?.closePopup(),
  }))

  return (
    <Marker ref={markerRef} position={position} icon={icon} eventHandlers={{ click: onClick }}>
      {children ? <Popup>{children}</Popup> : null}
    </Marker>
  )
})

export default MapMarker
