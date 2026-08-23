import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'

type FAQItem = {
  question: string
  answer: ReactNode
}

const faqItems: FAQItem[] = [
  {
    question: 'Comment demander un sacrement (baptême, mariage, confession) ?',
    answer: (
      <p>
        Utilisez le formulaire de contact en sélectionnant le sujet « Sacrements » ou appelez-nous
        au numéro de téléphone indiqué sur cette page. Vous pouvez également découvrir directement
        les <Link to="/services">services de l'Église</Link> et les démarches associées.
      </p>
    ),
  },
  {
    question: 'Comment rejoindre une paroisse ?',
    answer: (
      <p>
        Consultez notre carte des <Link to="/parishes">paroisses de l'Archidiocèse</Link> pour
        trouver celle qui est la plus proche de chez vous, puis{' '}
        <Link to="/register-parishioner">inscrivez-vous comme paroissien</Link> pour participer
        pleinement à la vie de la communauté locale.
      </p>
    ),
  },
  {
    question: 'Comment devenir bénévole ?',
    answer: (
      <p>
        Catholic Charities propose de nombreuses missions auprès des plus vulnérables. Découvrez les{' '}
        <Link to="/charities">programmes et actions</Link> de l'Archidiocèse et proposez votre aide
        via le formulaire avec le sujet « Bénévolat ».
      </p>
    ),
  },
  {
    question: "Puis-je soutenir l'Archidiocèse par un don ?",
    answer: (
      <p>
        Vous pouvez faire un <Link to="/donate">don en ligne</Link> pour aider l'Église dans sa
        mission et soutenir la préservation de son patrimoine culturel et religieux. Contactez-nous
        avec le sujet « Dons et legs » pour toute demande particulière.
      </p>
    ),
  },
  {
    question: 'Qui traite mon message ?',
    answer: (
      <p>
        Le Département des Services Généraux et la Chancellerie reçoit les messages et les transmets
        aux services concernés. Le personnel fera tout son possible pour vous recontacter par
        téléphone dans des délais raisonnables.
      </p>
    ),
  },
  {
    question: 'Comment contacter le Cardinal Edmund Hennessy ?',
    answer: (
      <p>
        Vous pouvez écrire au Cardinal via le formulaire avec le sujet « Cardinal Edmund Hennessy ».
        Si vous souhaitez être reçu en audience privée, vous devez en détailler les raisons afin que
        la demande puisse être traitée. Découvrez également son{' '}
        <Link to="/archbishop">portrait et sa mission</Link> comme Archevêque de Los Santos.
      </p>
    ),
  },
]

export function ContactFAQ() {
  return (
    <section className="bg-muted/70 py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold tracking-[0.3em] text-secondary uppercase">
            FAQ
          </p>
          <Typography variant="h2" className="border-none pb-0">
            Questions fréquentes
          </Typography>
          <Separator className="mx-auto mt-4 h-1 w-24 bg-catholic-gold" />
        </div>

        <Accordion>
          {faqItems.map((item) => (
            <AccordionItem
              key={item.question}
              className="mb-3 rounded-xl bg-card px-4 shadow-sm ring-1 ring-foreground/10"
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="pr-8 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-center text-muted-foreground">
          Vous n'avez pas trouvé votre réponse ?{' '}
          <a
            href="#contact-form"
            className="font-semibold text-primary underline underline-offset-4 hover:text-foreground"
          >
            Envoyez-nous un message
          </a>
        </p>
      </div>
    </section>
  )
}
