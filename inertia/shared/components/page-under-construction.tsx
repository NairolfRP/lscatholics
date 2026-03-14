import Head from '@/shared/components/app-head'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Construction } from 'lucide-react'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Container } from '@/shared/components/ui/container'
import { Typography } from '@/shared/components/ui/typography'

type Props = {
  pageTitle: string
}

export default function PageUnderConstruction({ pageTitle }: Props) {
  return (
    <>
      <Head title={pageTitle} />
      <HeroSection align="text-left" textColor="text-white">
        <Typography variant="h1" className="text-4xl text-inherit font-bold">
          {pageTitle}
        </Typography>
      </HeroSection>

      <Container spacing="md">
        <Alert variant="info">
          <Construction />
          <AlertTitle>Pas encore disponible</AlertTitle>
          <AlertDescription>
            Cette page est en cours de construction... Revenez par ici très bientôt !
          </AlertDescription>
        </Alert>
      </Container>
    </>
  )
}
