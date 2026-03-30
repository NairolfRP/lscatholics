import AppHead from '@/shared/components/app-head'
import { Hero } from '@/features/charities/components/hero'
import { Mission } from '@/features/charities/components/mission'
import { Programs } from '@/features/charities/components/programs'
import { Impact } from '@/features/charities/components/impact'
import { HelpSection } from '@/features/charities/components/help-section'
import { Contact } from '@/features/charities/components/contact'

export default function CatholicCharitiesPage() {
  return (
    <>
      <AppHead title="Catholic Charities">
        <meta
          head-key="description"
          name="description"
          content="Catholic Charities de l'Archidiocèse de Saint-Laurent : aide alimentaire, logement, soutien aux familles et aux réfugiés, au nom de l'Évangile."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Nunito:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </AppHead>

      <main>
        <Hero />
        <Mission />
        <Programs />
        <Impact />
        <HelpSection />
        <Contact />
      </main>
    </>
  )
}
