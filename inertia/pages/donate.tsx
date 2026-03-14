import { InertiaProps } from '@/types'
import DonateHero from '@/assets/images/donate-background.webp'
import Head from '@/shared/components/app-head'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { DonateTabs } from '@/features/donate/components/donate-tabs'
import { DonateSidebar } from '@/features/donate/components/donate-sidebar'
import { Container } from '@/shared/components/ui/container'

type PageProps = InertiaProps

export default function DonatePage({}: PageProps) {
  return (
    <>
      <Head title="Faire un don" image={DonateHero} />

      <HeroSection bgImage={DonateHero} align="text-left">
        <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-4 font-serif">
          Soutenir notre communauté
        </Typography>
      </HeroSection>

      <Container className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Aidez notre mission</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre générosité contribue à la mission de l'Église, à fournir une aide aux plus pauvres
            et à preserver le patrimoine local.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <DonateTabs />
          <DonateSidebar />
        </div>
      </Container>
    </>
  )
}
