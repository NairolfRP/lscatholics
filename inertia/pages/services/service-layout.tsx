import { ChevronLeft } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { urlFor } from '@/client'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { CHURCH_SERVICES } from '@/features/church-services/constants/church_services.constants'

type Props = {
  serviceId: (typeof CHURCH_SERVICES)[number]['id']
  children: React.ReactNode
}

export default function ServiceLayout({ serviceId, children }: Props) {
  const service = CHURCH_SERVICES.find((s) => s.id === serviceId)

  if (!service) return <p>Une erreur est survenue</p>

  return (
    <>
      <Head title={service.title} />

      <HeroSection
        bgColor={service.iconClasses ?? 'bg-linear-to-r from-catholic-blue to-catholic-blue/90'}
        py="16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{service.title}</h1>
        <p className="text-xl opacity-90">{service.description}</p>
      </HeroSection>

      <div className="container max-w-7xl mx-auto px-4 py-10">
        <Link href={urlFor('services.index')}>
          <Button className="cursor-pointer">
            <ChevronLeft /> Retourner à la liste des services
          </Button>
        </Link>
      </div>

      <section className="pt-5 pb-16">
        <div className="container max-w-7xl mx-auto px-4">{children}</div>
      </section>
    </>
  )
}
