import { InertiaProps } from '@/types'
import Head from '@/shared/components/app-head'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { HandHelping } from 'lucide-react'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { VolunteersSidebar } from '@/features/volunteers/components/volunteers-sidebar'
import { VolunteersForm } from '@/features/volunteers/components/form/volunteers-form'
import LoginAlert from '@/shared/components/auth/login-alert'

type PageProps = InertiaProps

export default function Volunteers({ user }: PageProps) {
  return (
    <>
      <Head title="Devenir bénévole" />
      <HeroSection
        py="16"
        bgColor=""
        textColor="text-white"
        className="bg-linear-to-r from-blue-400 to-blue-600"
      >
        <Typography
          variant="h2"
          className="flex items-center justify-center gap-2 text-inherit border-0 text-4xl font-bold mb-4"
        >
          <HandHelping /> Devenez bénévole
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">
          Rejoignez les Charités catholiques de l'Archidiocèse de Los Santos. Les possibilités
          d'aider son prochain sont infinies. Vivez une expérience humaine riche et changez des
          vies.
        </Typography>
      </HeroSection>

      <Container
        as="section"
        size="wide"
        spacing="md"
        className="grid grid-cols-1 md:grid-cols-5 gap-5 px-2"
      >
        <div className="flex flex-col gap-5 md:col-span-3">
          <Card>
            <CardContent>
              Nos programmes ont besoin de bénévoles au service des personnes les plus vulnérables
              des comtés de Los Santos, Ventura et Santa Barbara.
              <br />
              <br /> Vous pouvez participer à des actions concrètes comme des distributions
              alimentaires, des groupes de soutien, des animations pour les personnes en difficulté
              et plus encore. Nous pouvons vous affirmer que votre action, quoi qu'il arrive,
              changera des vies.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rejoindre l'équipe de bénévoles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Typography variant="blockquote" className="mt-0">
                <strong>Mission :</strong> Catholic Charities s'engage à témoigner du message du
                Christ en menant des actions auprès de diverses communautés, au service des pauvres
                et des plus vulnérables, afin de promouvoir la dignité humaine et défendre la
                justice sociale.
              </Typography>

              <Separator />

              {user ? (
                <VolunteersForm />
              ) : (
                <LoginAlert text="pour utiliser le formulaire de candidature comme bénévole." />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-5 md:col-span-2">
          <VolunteersSidebar />
        </div>
      </Container>
    </>
  )
}
