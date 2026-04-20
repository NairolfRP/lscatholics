import type { InertiaProps } from '@/types'
import Head from '@/shared/components/app-head'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import LoginAlert from '@/shared/components/auth/login-alert'
import { LinkText } from '@/shared/components/link-text'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { ParishionerBenefits } from '@/features/register-parishioner/components/parishioner-benefits'
import { ParishionerForm } from '@/features/register-parishioner/components/form/parishioner-form'
import { Container } from '@/shared/components/ui/container'
import { AsteriskRequired } from '@/shared/components/ui/asterisk-required'

type PageProps = InertiaProps

export default function RegisterParishionerPage({ user }: PageProps) {
  return (
    <>
      <Head title="S'enregistrer comme paroissien" />

      <HeroSection py="16" textColor="text-white">
        <Typography variant="h2" className="text-inherit border-0 text-4xl font-bold mb-4">
          Bienvenue chez vous !
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">
          Nous sommes ravis que vous vous intéressiez à rejoindre notre famille de familles.
          L'enregistrement aide les paroisses à mieux vous servir et vous permet de rester en
          contact avec elles.
        </Typography>
      </HeroSection>

      <Container size="content" className="max-w-4xl px-5 lg:px-12 py-12">
        <ParishionerBenefits />

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Formulaire d'enregistrement comme paroissien</CardTitle>
            <CardDescription>
              Veuilez remplir les informations ci-dessous pour enregistrer votre foyer comme
              paroissiens.
              <br />
              <br />
              <span className="font-bold">
                Seuls les champs indiqués avec un astérisque (<AsteriskRequired />) sont
                obligatoires.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <ParishionerForm />
            ) : (
              <LoginAlert text="pour enregistrer votre foyer en ligne." />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Vos informations resteront confidentielles et ne seront utilisées que pour la
            correspondance et les services des paroisses.
          </p>
          <p className="mt-2">
            Des questions ? <LinkText route="contact">Contactez-nous</LinkText>
          </p>
        </div>
      </Container>
    </>
  )
}
