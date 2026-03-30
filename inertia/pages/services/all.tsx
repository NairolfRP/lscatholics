import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { ArrowRight, HandHelping, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { cn } from '@/lib/utils'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { CHURCH_SERVICES } from '@/features/church-services/constants/church_services.constants'

export default function ServicesPage() {
  return (
    <>
      <Head title="Services" />

      <HeroSection bgColor="bg-linear-to-r from-catholic-blue to-catholic-blue/90" py="16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Services</h1>
        <p className="text-xl opacity-90">
          Tous les sacrements et sacramentaux catholiques ainsi que les services proposés pour vivre
          sa foi en Église
        </p>
      </HeroSection>

      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link route="charities.index">
              <Card className="flex justify-between h-full bg-primary/10 card-hover text-center">
                <CardContent className="p-6">
                  <div
                    className={cn(
                      'size-12 bg-catholic-blue text-white rounded-full flex items-center justify-center mx-auto mb-4'
                    )}
                  >
                    <HandHelping className="size-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Charité et humanitaire</h3>
                  <p className="text-sm text-gray-600 text-justify mb-4">
                    A travers son bras social, Catholic Charities, l'archidiocèse propose des
                    services pour soutenir les familles en difficulté et les personnes exclues, que
                    ce soit humainement, matériellement ou financièrement.
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end text-right text-gray-600 font-medium">
                  Programmes de Catholic Charities <ArrowRight className="size-4" />
                </CardFooter>
              </Card>
            </Link>

            {CHURCH_SERVICES.map((service) => (
              <Link key={service.id} route="services.single" routeParams={{ slug: service.slug }}>
                <Card className="flex justify-between h-full bg-primary/10 card-hover text-center">
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        'size-12 bg-catholic-gold text-white rounded-full flex items-center justify-center mx-auto mb-4',
                        service.iconClasses
                      )}
                    >
                      {service.icon ? (
                        <service.icon className="size-6" />
                      ) : (
                        <Heart className="size-6" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 text-justify mb-4">{service.description}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2 justify-end text-right text-gray-600 font-medium">
                    Lire plus <ArrowRight className="size-4" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
