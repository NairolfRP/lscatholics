import type { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'
import type { InertiaProps } from '@/shared/types/pages'
import Head from '@/shared/components/app-head'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import LoginAlert from '@/shared/components/auth/login-alert'
import ContactInfo from '@/features/contact/components/contact-info'
import { lazy, Suspense } from 'react'
import { MapFallback } from '@/shared/components/map/map-fallback'
import ContactForm from '@/features/contact/components/form/contact-form'
import { Container } from '@/shared/components/ui/container'

const ContactMap = lazy(() => import('@/features/contact/components/contact-map'))

type PageProps = InertiaProps<{
  subjects: typeof CONTACT_SUBJECTS
}>

export default function ContactPage({ user }: PageProps) {
  return (
    <>
      <Head title="Contact" />
      <HeroSection py="16" textColor="text-white">
        <Typography variant="h1" className="text-inherit text-4xl md:text-5xl font-bold mb-4">
          Nous Contacter
        </Typography>
        <Typography className="text-inherit text-xl opacity-90">
          Nous sommes là pour vous. N'hésitez pas à nous appeler ou nous écrire pour poser vos
          questions et nous faire part de vos préoccupations et commentaires.
        </Typography>
      </HeroSection>

      <Container size="content" spacing="md">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="flex flex-col gap-4">
            <Typography
              variant="h2"
              className="border-none text-2xl font-bold text-catholic-purple mb-6"
            >
              Envoyez-nous un message
            </Typography>

            {!user ? (
              <LoginAlert text="pour utiliser le formulaire de contact." />
            ) : (
              <ContactForm />
            )}
          </div>

          <ContactInfo />
        </div>
      </Container>

      <Suspense fallback={<MapFallback />}>
        <ContactMap />
      </Suspense>
    </>
  )
}
