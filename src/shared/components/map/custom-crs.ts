import type { CRS, LatLng } from 'leaflet'
import L from 'leaflet'

/**
 * Custom CRS mapping raw GTA V world coordinates onto the square tile world.
 * The tile pyramid is 8192 x 8192 units wide at max zoom (5).
 */
const centerX = 117.3
const centerY = 172.8
const scaleX = 0.02072
const scaleY = 0.0205

export function createGta5Crs(): CRS {
  return L.Util.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale(zoom: number) {
      return Math.pow(2, zoom)
    },
    zoom(sc: number) {
      return Math.log(sc) / 0.6931471805599453
    },
    distance(pos1: LatLng, pos2: LatLng) {
      const differenceX = pos2.lng - pos1.lng
      const differenceY = pos2.lat - pos1.lat
      return Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    },
    transformation: new L.Transformation(scaleX, centerX, -scaleY, centerY),
    infinite: true,
  })
}
