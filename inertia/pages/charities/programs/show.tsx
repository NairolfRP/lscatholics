import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin, Phone } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'
import type { ProgramDetail } from '@/features/charities/types/charities.types'
import Head from '@/shared/components/app-head'
import { useState } from 'react'
import { getProgramBySlug } from '@/features/charities/constants/programs.constants'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

type Props = {
  slug: string
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav
      className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest"
      aria-label="Fil d'Ariane"
    >
      <Link route="home" className="hover:text-muted-foreground/70 transition-colors">
        Accueil
      </Link>
      <ChevronRight className="h-3 w-3" />
      <Link route="charities.index" className="hover:text-muted-foreground/70 transition-colors">
        Catholic Charities
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="text-primary">{title}</span>
    </nav>
  )
}

function PageHeader({ program }: { program: ProgramDetail }) {
  const Icon = program.icon
  return (
    <div className="pt-5 pb-16">
      <Breadcrumb title={program.title} />

      <div className="mt-10 flex items-start gap-6">
        <div className="shrink-0 p-4 bg-primary/8 rounded-sm mt-1">
          <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.25em] mb-3">
            {program.tag}
          </p>
          <h1
            className="leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 5vw, 3.25rem)',
              fontWeight: 600,
            }}
          >
            {program.title}
          </h1>
          <p
            className="mt-4 text-muted-foreground text-base font-light leading-relaxed max-w-2xl"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {program.description}
          </p>
        </div>
      </div>
    </div>
  )
}

function AboutSection({ about }: { about: string }) {
  return (
    <section aria-labelledby="about-heading">
      <h2
        id="about-heading"
        className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        À propos
      </h2>
      <p
        className="text-stone-700 text-base font-light leading-[1.85]"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {about}
      </p>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-snug"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ServicesAndEligibility({
  services,
  eligibility,
}: Pick<ProgramDetail, 'services' | 'eligibility'>) {
  return (
    <section className="grid md:grid-cols-2 gap-12 md:gap-16">
      <div>
        <h2
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Ce que nous offrons
        </h2>
        <CheckList items={services} />
      </div>
      <div>
        <h2
          className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-5"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Qui peut bénéficier
        </h2>
        <CheckList items={eligibility} />
      </div>
    </section>
  )
}

function ContactSection({ contact }: { contact: ProgramDetail['contact'] }) {
  const rows = [
    { icon: Phone, label: contact.phone, href: `tel:${contact.phone.replace(/\D/g, '')}` },
    { icon: MapPin, label: contact.address, href: undefined },
  ] as const

  return (
    <Card className="p-8 md:p-10 gap-2">
      <CardHeader className="p-0">
        <CardTitle className="uppercase font-light tracking-[0.25em] text-muted-foreground">
          Nous contacter
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 p-0">
        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-3 items-center">
          {rows.map(({ icon: Icon, label, href }) => {
            const inner = (
              <span
                className="flex items-center gap-2.5 text-sm text-stone-600"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                <Icon className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                {label}
              </span>
            )
            return href ? (
              <a key={label} href={href} className="hover:text-primary transition-colors">
                {inner}
              </a>
            ) : (
              <div key={label}>{inner}</div>
            )
          })}
        </div>
        <Link route="contact">
          <Button
            variant="default"
            className="px-8 py-5 text-xs uppercase tracking-widest"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Demander de l'aide
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function BackLink() {
  return (
    <Link
      route="charities.index"
      className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
    >
      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-0.5 transition-transform" />
      Catholic Charities
    </Link>
  )
}

export default function ProgramShowPage({ slug }: Props) {
  const [program] = useState<ProgramDetail>(() => getProgramBySlug(slug)!)

  return (
    <>
      <Head title={`${program.title} - Catholic Charities`} description={program.description}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Nunito:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Container size="content" className="px-2 py-40">
        <Card>
          <CardContent>
            <PageHeader program={program} />
            <Separator className="bg-stone-100 mb-12" />

            <div className="space-y-14">
              <AboutSection about={program.about} />
              <Separator className="bg-stone-100" />
              <ServicesAndEligibility
                services={program.services}
                eligibility={program.eligibility}
              />
              <Separator className="bg-stone-100" />
              <ContactSection contact={program.contact} />
              <BackLink />
            </div>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
