import { AlertTriangle, MapPin, Phone } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { ARCHDIOCESE_SOCIAL_MEDIAS } from '@/shared/constants/social.constants'
import { cn } from '@/lib/utils'
import { Typography } from '@/shared/components/ui/typography'

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <Typography
          variant="h2"
          className="border-none text-2xl font-bold text-catholic-purple mb-6"
        >
          Informations de contact
        </Typography>

        <Card className="p-6">
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="size-10 bg-catholic-gold text-white rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  Tour de la Cathédrale Notre-Dame-des-Saints
                </h3>
                <p className="text-gray-600">
                  Ginger street, Little Seoul
                  <br />
                  Los Santos, SA 90010
                  <br />
                  États-Unis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="size-10 bg-catholic-purple text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                <p className="text-gray-600">
                  Accueil: 700
                  <br />
                  Urgences: 700
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Contact d'urgence</h3>
              <p className="text-red-700 text-sm mb-3">
                Pour les situations d'urgence spirituelle (derniers sacrements, extrême-onction,
                confession urgente), contactez notre ligne 24h/24.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <Phone className="size-4 mr-2" />
                700
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold text-lg mb-4">Suivez-nous</h3>
        <div className="flex gap-3">
          {ARCHDIOCESE_SOCIAL_MEDIAS.filter((s) => !s.isOOC && !s.footerOnly).map((social) => (
            <a
              key={social.url}
              href={social.url}
              title={social.title}
              className={cn(
                'size-10 text-white rounded-full flex items-center justify-center transition-colors',
                social.colorClasses
              )}
              target="_blank"
            >
              <social.icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
