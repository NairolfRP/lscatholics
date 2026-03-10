import type { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'
import { InertiaProps } from '@/types'
import Head from '@/shared/components/app-head'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Typography } from '@/shared/components/ui/typography'
import { ContactSuccessAlert } from '@/features/contact/components/form/contact-success-alert'
import LoginAlert from '@/shared/components/auth/login-alert'
import ContactInfo from '@/features/contact/components/contact-info'
import ContactMap from '@/features/contact/components/contact-map'
import { Suspense } from 'react'
import { MapFallback } from '@/shared/components/map/map-fallback'
import ContactForm from '@/features/contact/components/form/contact-form'

type PageProps = InertiaProps<{
  subjects: typeof CONTACT_SUBJECTS
}>

export default function ContactPage({ user }: PageProps) {
  return (
    <>
      <Head title="Contact" />
      <HeroSection py="16">
        <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-4 font-serif">
          Nous Contacter
        </Typography>
        <p className="text-xl opacity-90">
          Nous sommes là pour vous. N'hésitez pas à nous appeler ou nous écrire pour poser vos
          questions et nous faire part de vos préoccupations et commentaires.
        </p>
      </HeroSection>

      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <ContactSuccessAlert />

          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-catholic-purple mb-6 font-serif">
                Envoyez-nous un message
              </h2>

              {!user ? (
                <LoginAlert text="pour utiliser le formulaire de contact." />
              ) : (
                <ContactForm />
              )}
            </div>

            <ContactInfo />
          </div>
        </div>
      </section>

      <Suspense fallback={<MapFallback />}>
        <ContactMap />
      </Suspense>
    </>
  )
}
