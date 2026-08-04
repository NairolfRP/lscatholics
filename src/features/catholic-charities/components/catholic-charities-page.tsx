import { CharitiesContactSection } from './charities-contact-section'
import { CharitiesHelpSection } from './charities-help-section'
import { CharitiesHero } from './charities-hero'
import { CharitiesImpact } from './charities-impact'
import { CharitiesMission } from './charities-mission'
import { CharitiesPrograms } from './charities-programs'

export function CatholicCharitiesPage() {
  return (
    <>
      <CharitiesHero />
      <CharitiesMission />
      <CharitiesPrograms />
      <CharitiesImpact />
      <CharitiesHelpSection />
      <CharitiesContactSection />
    </>
  )
}
