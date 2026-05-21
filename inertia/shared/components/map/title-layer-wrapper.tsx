import { FC, useEffect, useState } from 'react'
import { TileLayer, TileLayerProps, useMap } from 'react-leaflet'
import L from 'leaflet'

export const TileLayerWrapper: FC<TileLayerProps> = ({
  url,
  minZoom,
  maxZoom,
  keepBuffer,
  noWrap,
  ...rest
}: TileLayerProps) => {
  const map = useMap()
  const [calculatedBounds, setCalculatedBounds] = useState<L.LatLngBounds | undefined>()

  useEffect(() => {
    if (!map || !map.getContainer()) return

    const maxZoomLevel = map.getMaxZoom()
    const southWest = map.unproject([0, 8192], maxZoomLevel)
    const northEast = map.unproject([8192, 0], maxZoomLevel)
    const bounds = new L.LatLngBounds(southWest, northEast)

    map.setMaxBounds(bounds)
    setCalculatedBounds(bounds)

    return () => {
      map.setMaxBounds([])
    }
  }, [map])

  if (!calculatedBounds) return null

  return (
    <TileLayer
      keepBuffer={keepBuffer}
      bounds={calculatedBounds}
      noWrap={noWrap}
      attribution="GTA V Map"
      url={url}
      minZoom={minZoom}
      maxZoom={maxZoom}
      {...rest}
    />
  )
}
