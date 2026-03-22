import { Container } from '@/shared/components/ui/container'
import { Link } from '@adonisjs/inertia/react'
import { urlFor } from '@/client'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Heart } from 'lucide-react'
import { SOCIAL_DISCORD } from '@/shared/constants/social.constants'
import DiscordIcon from '@/shared/components/svg/discord'

export function HomeQuickLinks() {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href={urlFor('archbishop.index')}>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-catholic-red rounded-full text-white text-2xl pb-1 flex items-center justify-center mx-auto mb-4">
                  ✠
                </div>
                <h3 className="font-semibold mb-2">Cardinal Ronan Callahan</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Notre Archevêque, Son Éminence le Cardinal Ronan Callahan
                </p>
                <Button variant="outline" size="sm">
                  Découvrir
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href={urlFor('services.index')}>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-catholic-gold text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="size-6" />
                </div>
                <h3 className="font-semibold mb-2">Sacrements</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Baptême, communion, mariage, confirmation, confession...
                </p>
                <Button variant="outline" size="sm">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          </Link>

          <a
            href={SOCIAL_DISCORD.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="h-full bg-[#5865F2] text-[#E0E3FF] text-center cursor-pointer card-hover transition-shadow">
              <CardContent className="flex flex-col justify-center h-full p-6">
                <div className="size-12 flex items-center justify-center mx-auto mb-4">
                  <DiscordIcon width={48} height={48} />
                </div>
                <h3 className="font-bold mb-2">(( Rejoindre notre serveur Discord ))</h3>
              </CardContent>
            </Card>
          </a>
        </div>
      </Container>
    </section>
  )
}
