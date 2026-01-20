import type { CRS, LatLng } from 'leaflet'

const centerX = 117.3
const centerY = 172.8
const scaleX = 0.02072
const scaleY = 0.0205

export async function getCustomCRS(): Promise<CRS> {
  const L = await import('leaflet')
  return L.Util.extend({}, L.CRS.Simple, {
    projection: L.Projection.LonLat,
    scale: function (zoom: number) {
      return Math.pow(2, zoom)
    },
    zoom: function (sc: number) {
      return Math.log(sc) / 0.6931471805599453
    },
    distance: function (pos1: LatLng, pos2: LatLng) {
      const differenceX = pos2.lng - pos1.lng
      const differenceY = pos2.lat - pos1.lat
      return Math.sqrt(differenceX * differenceX + differenceY * differenceY)
    },
    transformation: new L.Transformation(scaleX, centerX, -scaleY, centerY),
    infinite: true,
  })
}

export type GTAVCRS = ReturnType<typeof getCustomCRS>
