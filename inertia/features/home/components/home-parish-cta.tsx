import { Container } from '@/shared/components/ui/container'
import { Typography } from '@/shared/components/ui/typography'
import { MapPin, NotebookPen } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'

const CTA_ITEMS = [
  {
    route: 'registerParishioner.index' as const,
    icon: <NotebookPen className="w-5 h-5 mr-2" />,
    label: "S'enregistrer comme paroissien",
    variant: 'outline' as const,
    className: 'border-white hover:bg-white hover:text-catholic-purple',
  },
  {
    route: 'find.parishes' as const,
    icon: <MapPin className="w-5 h-5 mr-2" />,
    label: 'Trouver une paroisse',
    variant: 'default' as const,
    className: 'bg-catholic-gold hover:bg-yellow-600',
  },
]

export function HomeParishCTA() {
  return (
    <section className="py-16 bg-catholic-purple text-white">
      <Container className="text-center">
        <Typography
          variant="h2"
          className="text-2xl md:text-4xl border-0 text-white font-bold mb-6"
        >
          Rejoignez nos paroisses
        </Typography>
        <Typography className="text-lg md:text-xl text-white mb-8 opacity-90 max-w-2xl mx-auto">
          Découvrez la richesse de notre foi et participez à la vie de notre communauté
        </Typography>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {CTA_ITEMS.map(({ route, icon, label, variant, className }) => (
            <Button key={route} variant={variant} size="lg" className={className} asChild>
              <Link route={route}>
                {icon}
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </Container>
    </section>
  )
}
