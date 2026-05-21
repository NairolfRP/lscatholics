import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'
import GTA5Map from '@/shared/components/map/gta5-map'
import MapMarker from '@/shared/components/map/map-marker'

export default function ContactMap() {
  return (
    <section className="py-16 bg-gray-50">
      <Container size="fluid" className="mx-auto h-auto px-4">
        <Typography
          variant="h2"
          className="border-none text-4xl font-bold text-catholic-purple mb-8 text-center"
        >
          Nous trouver
        </Typography>

        <GTA5Map
          className="aspect-video rounded-lg w-full max-h-95"
          center={[-685.58, -765.889]}
          zoom={5}
        >
          <MapMarker position={[-685.58, -765.889]}>
            <div className="p-2">
              <h4 className="font-bold">Tour de la Cathédrale Notre-Dame-des-Saints</h4>
              Ginger Street, Little Seoul
              <br />
              Los Santos, SA 90010
            </div>
          </MapMarker>
        </GTA5Map>
      </Container>
    </section>
  )
}
