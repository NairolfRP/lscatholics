import { lazy } from 'react'

const GTA5Map = lazy(() => import('@/shared/components/map/gta5-map'))
const MapMarker = lazy(() => import('@/shared/components/map/map-marker'))

export default function ContactMap() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-catholic-purple mb-8 text-center font-serif">
          Nous trouver
        </h2>

        <GTA5Map className="aspect-video rounded-lg w-full" center={[-685.58, -765.889]} zoom={5}>
          <MapMarker position={[-685.58, -765.889]}>
            <div className="p-2">
              <h4 className="font-bold">Tour de la Cathédrale Notre-Dame-des-Saints</h4>
              Ginger Street, Little Seoul
              <br />
              Los Santos, SA 90010
            </div>
          </MapMarker>
        </GTA5Map>
      </div>
    </section>
  )
}
