import type { LatLngTuple } from 'leaflet'

export type Parish = {
  id: number
  image?: string
  name: string
  address: string
  description?: string
  priestOffice?: string
  priestName?: string
  coords?: LatLngTuple
  isCathedral?: boolean
}
