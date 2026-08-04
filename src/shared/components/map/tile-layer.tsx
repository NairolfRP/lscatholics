import type { TileLayerProps } from 'react-leaflet'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import { TileLayer, useMap } from 'react-leaflet'
import { createGta5Crs } from './custom-crs'

type Props = Omit<TileLayerProps, 'url'> & {
  url: string
  /** Width/height in tiles of the full map world at max zoom. */
  worldSize?: number
}

/**
 * Bounds of the square GTA V map world, projected from the raw world size at
 * max zoom. No map instance is needed, so they can be computed lazily.
 */
function gta5WorldBounds(worldSize: number): L.LatLngBounds {
  const southWest = createGta5Crs().pointToLatLng(new L.Point(0, worldSize), 5)
  const northEast = createGta5Crs().pointToLatLng(new L.Point(worldSize, 0), 5)
  return L.latLngBounds(southWest, northEast)
}

/**
 * Tile layer bound to the GTA V map square.
 * Leaflet cannot infer bounds from a custom CRS, so we constrain the map to
 * the projected world corners.
 */
export function Gta5TileLayer({
  url,
  worldSize = 8192,
  minZoom = 0,
  maxZoom = 5,
  keepBuffer = 64,
  noWrap = true,
  ...rest
}: Props) {
  const map = useMap()
  const [bounds] = useState(() => gta5WorldBounds(worldSize))

  useEffect(() => {
    map.setMaxBounds(bounds)
    return () => {
      map.setMaxBounds([])
    }
  }, [map, bounds])

  return (
    <TileLayer
      {...rest}
      url={url}
      bounds={bounds}
      keepBuffer={keepBuffer}
      noWrap={noWrap}
      minZoom={minZoom}
      maxZoom={maxZoom}
      attribution="Carte : GTA V"
    />
  )
}
