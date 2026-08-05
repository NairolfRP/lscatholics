import { createFileRoute } from '@tanstack/react-router'
import { PhoneIcon, SendIcon, SirenIcon } from 'lucide-react'
import { ContactFAQ } from '#/features/contact/components/contact-faq.tsx'
import { ContactForm } from '#/features/contact/components/contact-form.tsx'
import { ContactInfoPanel } from '#/features/contact/components/contact-info-panel.tsx'
import { pageMetadata } from '#/utils/seo.ts'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export const Route = createFileRoute('/_app/contact')({
  head: () => ({
    meta: pageMetadata('Nous contacter', {
      metadata: {
        description:
          "Contactez l'Archidiocèse de Los Santos : chancellerie, paroisses, sacrements, presse et plus encore. Coordonnées, horaires et formulaire de contact.",
      },
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Hero
        variant="split"
        backgroundColor="var(--color-catholic-purple)"
        imageSrc="/assets/images/olscathedral.webp"
        imageAlt="La cathédrale Notre-Dame-des-Saints de Los Santos"
        title={
          <Typography variant="h1">
            Contactez
            <br />
            l'Archidiocèse de{' '}
            <span className="bg-linear-135 from-[#f0c14b] via-[#e0a83e] to-[#b8860b] bg-clip-text text-transparent">
              Los Santos
            </span>
          </Typography>
        }
        subtitle="Une question, une demande de sacrement ou autre chose ? Nous ferons de notre mieux pour vous répondre."
      >
        <a href="#contact-form" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
          <SendIcon /> Envoyer un message
        </a>
      </Hero>

      <section className="container mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <EmergencyBanner />

        <div className="relative grid grid-cols-1 gap-10 pb-16 lg:grid-cols-3">
          <div id="contact-form" className="order-2 scroll-mt-32 lg:order-1 lg:col-span-2">
            <ContactForm />
          </div>

          <div className="order-1 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:order-2 lg:self-start">
            <ContactInfoPanel />
          </div>
        </div>
      </section>

      <ContactFAQ />
    </>
  )
}

function EmergencyBanner() {
  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-red-800/40 dark:bg-red-950/20">
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
          <SirenIcon className="size-5" />
        </span>
        <div>
          <Typography variant="h3" className="text-red-800 dark:text-red-400">
            Contact d'urgence
          </Typography>
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            Pour les situations d'urgence spirituelle (derniers sacrements, extrême-onction,
            confession urgente), notre ligne est disponible 24h/24.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-start rounded-full border border-red-300 bg-white px-5 py-2.5 sm:self-center dark:border-red-800/50 dark:bg-red-900/30">
        <PhoneIcon className="size-4 text-red-600 dark:text-red-400" />
        <span className="text-lg font-bold text-red-800 dark:text-red-400">700</span>
      </div>
    </div>
  )
}
