import { ChevronLeft } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { urlFor } from '@/lib/client'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { CHURCH_SERVICES } from '@/features/church-services/constants/church_services.constants'
import { Typography } from '@/shared/components/ui/typography'
import { Container } from '@/shared/components/ui/container'

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
        textColor="text-white"
      >
        <Typography variant="h1" className="text-inherit font-bold mb-4">
          {service.title}
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">{service.description}</Typography>
      </HeroSection>

      <Container size="content" spacing="md" className="flex flex-col gap-15">
        <Link href={urlFor('services.index')}>
          <Button className="cursor-pointer">
            <ChevronLeft /> Retourner à la liste des services
          </Button>
        </Link>

        <section>{children}</section>
      </Container>
    </>
  )
}
