import Head from '@/shared/components/app-head'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Construction } from 'lucide-react'
import HeroSection from '@/shared/components/layout/default/hero-section'

type Props = {
  pageTitle: string
}

export default function PageUnderConstruction({ pageTitle }: Props) {
  return (
    <>
      <Head title={pageTitle} />
      <HeroSection align="text-left">
        <h1 className="text-4xl text-white font-bold">{pageTitle}</h1>
      </HeroSection>

      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <Alert variant="info">
            <Construction />
            <AlertTitle>Pas encore disponible</AlertTitle>
            <AlertDescription>
              Cette page est en cours de construction... Revenez par ici très bientôt !
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </>
  )
}
