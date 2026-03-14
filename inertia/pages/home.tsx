import HomepageBanner from '@/assets/images/cathedral-mass-with-cardinal.webp'
import { WhenVisible } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { Calendar, CircleAlert, Heart, MapPin, NotebookPen } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { formatNumber, yearsBetween } from '@/lib/utils'
import { urlFor } from '@/client'
import { ARCHDIOCESAN_HISTORY_START_DATE } from '@/shared/constants/archdiocese.constants'
import { SOCIAL_DISCORD } from '@/shared/constants/social.constants'
import DiscordIcon from '@/shared/components/svg/discord'
import type { Data } from '@generated/data'
import type { InertiaProps } from '@/types'
import HeroSection from '@/shared/components/layout/default/hero-section'
import PostCard from '@/shared/components/post-card'
import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'

type PageProps = InertiaProps<{
  posts?: {
    data: Data.Posts.Post.Variants['homePosts'][]
    error?: string
  }
}>

export default function HomePage({ posts = { data: [], error: '' } }: PageProps) {
  const now = new Date()
  const yearsOfHistory = yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, now)
  const nbOfFaithful = formatNumber(4_349_267)

  return (
    <>
      <HeroSection bgImage={HomepageBanner} height="min-h-[50vh]">
        <div className="max-w-4xl mx-auto text-center">
          <Typography variant="h1" className="text-5xl md:text-6xl font-bold mb-6 font-serif">
            Bienvenue sur le site de
            <span className="text-gradient block">l'Archidiocèse de Los Santos</span>
          </Typography>
          <Typography className="text-white text-xl md:text-2xl mb-8 opacity-90">
            Rejoignez-nous dans la prière, la communion et le service au sein de l'Église catholique
            à Los Santos
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-catholic-gold hover:bg-yellow-600 text-white" asChild>
              <Link href={urlFor('find.events')}>
                <Calendar className="w-5 h-5 mr-2" />
                Prochains événements
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
              asChild
            >
              <Link href={urlFor('about-us')}>Découvrir notre communauté</Link>
            </Button>
          </div>
        </div>

        {/* <PageBanner corner={
          <>
            <h3 className="font-semibold mb-2">Prochaines Célébrations</h3>
            <div className="space-y-1 text-xs">
              <div>Messe de 18h - Cathédrale</div>
              <div>Vêpres - 19h30</div>
            </div>
          </>
        } /> */}
      </HeroSection>

      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-3 gap-6">
            {/* <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="size-12 bg-catholic-purple text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="size-6" />
                </div>
                <h3 className="font-semibold mb-2">Horaires</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Consultez les horaires de messes et célébrations
                </p>
                <Button variant="outline" size="sm">Voir les horaires</Button>
              </CardContent>
            </Card> */}

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
            <Button
              variant="outline"
              size="lg"
              className="border-white hover:bg-white hover:text-catholic-purple"
              asChild
            >
              <Link href={urlFor('registerParishioner.index')}>
                <NotebookPen className="w-5 h-5 mr-2" />
                S'enregistrer comme paroissien
              </Link>
            </Button>
            <Button size="lg" className="bg-catholic-gold hover:bg-yellow-600" asChild>
              <Link href={urlFor('find.parishes')}>
                <MapPin className="w-5 h-5 mr-2" />
                Trouver une paroisse
              </Link>
            </Button>
          </div>
        </Container>
      </section>

      <Container as="section" spacing="md">
        <div className="text-center mb-12">
          <Typography
            variant="h2"
            className="border-none text-3xl md:text-4xl font-bold text-catholic-purple mb-4 font-serif"
          >
            Actualités de l'Archidiocèse
          </Typography>
          <div className="w-24 h-1 bg-catholic-gold mx-auto cross-divider" />
        </div>

        <WhenVisible
          data="posts"
          fallback={
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 h-full">
                  <Skeleton className="h-[400px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          {posts?.error ? (
            <Alert variant="destructive">
              <CircleAlert />
              <AlertDescription>{posts.error}</AlertDescription>
            </Alert>
          ) : posts?.data?.length === 0 ? (
            <div className="italic text-center">Aucun article pour le moment !</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {posts?.data?.map((post) => (
                <PostCard
                  key={`home-recent-post-${post.id}`}
                  title={post.title}
                  routeParams={{ slug: post.slug }}
                  category={post.category ?? undefined}
                  publishedAt={post.publishedAt ?? ''}
                />
              ))}
            </div>
          )}
        </WhenVisible>

        {(posts?.data?.length ?? 0) > 0 && (
          <div className="text-center mt-8">
            <Button variant="default" size="lg" className="cursor-pointer" asChild>
              <Link href={urlFor('news.index')}>Voir toutes les actualités</Link>
            </Button>
          </div>
        )}
      </Container>

      {/* <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="aspect-square bg-linear-to-br from-catholic-gold/20 to-catholic-purple/20 md:h-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center">
                      <span className="text-4xl">👨‍💼</span>
                    </div>
                  </div>
                </div>
                <CardContent className="md:w-2/3 p-8">
                  <Badge className="mb-4">Message de l'Archevêque</Badge>
                  <h3 className="text-2xl font-bold mb-4 text-catholic-purple font-serif">
                    Cardinal Ronan Callahan
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "Chers frères et sœurs en Christ, c'est avec une joie immense que je vous
                    accueille sur le site de notre Archidiocèse. Que cette plateforme soit pour vous
                    un lieu de rencontre, de prière et de communion fraternelle."
                  </p>
                  <Button variant="outline">
                    Lire le message complet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section> */}

      <section className="py-16 bg-catholic-gold text-white">
        <Container>
          <div className="grid md:grid-cols-4 gap-13 md:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-700">288</div>
              <div className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                Paroisses
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-catholic-purple">42</div>
              <div className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                langues différentes
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-catholic-red">{nbOfFaithful}</div>
              <div className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                Catholiques
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-catholic-blue">{yearsOfHistory}</div>
              <div className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                Ans d'histoire
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-catholic-purple mb-8 font-serif">
              Prière du Jour
            </h2>
            <Card className="p-8">
              <CardContent className="space-y-4">
                <div className="text-6xl text-catholic-gold mb-4">✠</div>
                <blockquote className="text-lg italic text-gray-700 font-serif leading-relaxed">
                  "Seigneur, accorde-nous la grâce de Te chercher de tout notre cœur, et de Te
                  trouver dans le silence de la prière et la joie du partage fraternel."
                </blockquote>
                <footer className="text-sm text-gray-500 mt-4">
                  — Prière pour l'unité de l'Église
                </footer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* <section className="py-16 bg-catholic-gold text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 font-serif">Restez Connecté</h2>
            <p className="text-lg mb-8 opacity-90">
              Recevez nos actualités et méditations quotidiennes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-catholic-gold hover:bg-gray-100">
                <Mail className="w-4 h-4 mr-2" />
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </>
  )
}
