import { ChurchIcon, GraduationCapIcon, HeartHandshakeIcon, HomeIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { cn } from '#shared/lib/utils.ts'

const IMPACT_ITEMS = [
  {
    icon: HomeIcon,
    iconClassName: 'bg-blue-500/10 text-blue-600',
    title: 'Soutien communautaire',
    description: 'Soutenir les familles et les personnes démunies.',
  },
  {
    icon: ChurchIcon,
    iconClassName: 'bg-yellow-500/10 text-yellow-600',
    title: 'Patrimoine',
    description:
      'Restauration et conservation des monuments et du patrimoine religieux, dont la Cathédrale Notre-Dame-des-Saints.',
  },
  {
    icon: GraduationCapIcon,
    iconClassName: 'bg-green-500/10 text-green-600',
    title: 'Éducation',
    description:
      "Financement des établissements d'enseignement et des programmes de formation catholiques.",
  },
  {
    icon: HeartHandshakeIcon,
    iconClassName: 'bg-purple-500/10 text-purple-600',
    title: 'Ministères paroissiaux',
    description:
      "Soutien à la mission de l'Église, à la liturgie, à la musique et aux programmes spirituels.",
  },
]

export function DonateSidebar() {
  return (
    <>
      <Card className="border-primary/20 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChurchIcon className="size-5" /> Informations fiscales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography className="text-muted-foreground">
            L'Archidiocèse de Los Santos est une organisation religieuse sans but lucratif. Vos dons
            sont déductibles d'impôts, conformément aux lois fédérales, étatiques et locales
            applicables.
          </Typography>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartHandshakeIcon className="size-5" /> Votre impact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {IMPACT_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full',
                    item.iconClassName
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div>
                  <Typography className="p-t0 m-0 mb-0 font-semibold">{item.title}</Typography>
                  <Typography className="text-sm text-muted-foreground not-first:mt-1">
                    {item.description}
                  </Typography>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </>
  )
}
