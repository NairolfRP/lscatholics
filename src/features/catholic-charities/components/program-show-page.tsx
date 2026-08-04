import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react'
import {
  getProgramIcon,
  programs,
} from '#/features/catholic-charities/constants/programs.constants'
import type {
  ProgramDetail,
  ProgramDetailData,
} from '#/features/catholic-charities/types/charities.types'
import { Badge } from '#shared/components/ui/badge'
import { buttonVariants } from '#shared/components/ui/button'

const sections = [
  { id: 'about', label: 'À propos' },
  { id: 'services', label: 'Ce que nous offrons' },
  { id: 'eligibility', label: 'Qui peut bénéficier' },
  { id: 'contact', label: 'Nous contacter' },
] as const

export function ProgramShowPage({ program }: { program: ProgramDetailData }) {
  const Icon = getProgramIcon(program.slug)
  const currentIndex = programs.findIndex((p) => p.slug === program.slug)
  const previous = currentIndex > 0 ? programs[currentIndex - 1] : undefined
  const next = currentIndex < programs.length - 1 ? programs[currentIndex + 1] : undefined

  return (
    <>
      <section className="bg-zinc-950 pt-(--header-height) pb-14">
        <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <Breadcrumb title={program.title} />
          <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-catholic-red/15 text-amber-400 md:size-20">
              <Icon className="size-8 md:size-10" strokeWidth={1.5} />
            </span>
            <div>
              <Badge
                variant="outline"
                className="border-amber-400/40 tracking-widest text-amber-400 uppercase"
              >
                {program.tag}
              </Badge>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
                {program.title}
              </h1>
              <p className="mt-4 max-w-2xl text-lg/relaxed text-white/75">{program.description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-16">
            <Section id="about" title="À propos">
              <p className="text-lg/relaxed text-muted-foreground">{program.about}</p>
            </Section>

            <Section id="services" title="Ce que nous offrons">
              <CheckList items={program.services} />
            </Section>

            <Section id="eligibility" title="Qui peut bénéficier">
              <CheckList items={program.eligibility} />
            </Section>

            <Section id="contact" title="Nous contacter">
              <ContactCard contact={program.contact} />
            </Section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
            <nav
              aria-label="Dans cette page"
              className="rounded-2xl bg-muted p-6 ring-1 ring-foreground/10"
            >
              <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                Dans cette page
              </p>
              <ul className="mt-4 space-y-1">
                {sections.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-background"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="rounded-2xl bg-catholic-blue p-6 text-white">
              <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                Coordonnées
              </p>
              <ul className="mt-4 space-y-4">
                <li className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <a
                    href={`tel:${program.contact.phone}`}
                    className="font-medium transition hover:text-amber-300"
                  >
                    {program.contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 size-4 shrink-0 text-amber-400" />
                  <span className="leading-relaxed text-white/85">{program.contact.address}</span>
                </li>
              </ul>
            </div>

            <Link
              to="/charities"
              className={buttonVariants({ variant: 'outline', className: 'w-full gap-2' })}
            >
              <ArrowLeftIcon className="size-4" /> Tous les programmes
            </Link>
          </aside>
        </div>

        <ProgramPager previous={previous} next={next} />
      </div>
    </>
  )
}

function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="transition hover:text-foreground">
            Accueil
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="size-4" />
        </li>
        <li>
          <Link to="/charities" className="transition hover:text-foreground">
            Catholic Charities
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRightIcon className="size-4" />
        </li>
        <li aria-current="page" className="font-medium text-foreground">
          {title}
        </li>
      </ol>
    </nav>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-(--header-height)">
      <h2 className="text-2xl font-bold tracking-tight uppercase">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
        >
          <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-catholic-red dark:text-red-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function ContactCard({ contact }: { contact: ProgramDetail['contact'] }) {
  const rows = [
    { icon: PhoneIcon, label: 'Téléphone', value: contact.phone },
    { icon: MapPinIcon, label: 'Adresse', value: contact.address },
  ]

  return (
    <div className="grid gap-8 rounded-2xl bg-muted p-8 ring-1 ring-foreground/10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <ul className="space-y-5">
        {rows.map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-start gap-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-secondary uppercase">{label}</p>
              <p className="mt-0.5 leading-relaxed font-medium">{value}</p>
            </div>
          </li>
        ))}
      </ul>
      <a
        href={`tel:${contact.phone}`}
        className={buttonVariants({ variant: 'default', className: 'h-12 gap-2 md:px-8' })}
      >
        <PhoneIcon className="size-4" /> Demander de l'aide
      </a>
    </div>
  )
}

function ProgramPager({ previous, next }: { previous?: ProgramDetail; next?: ProgramDetail }) {
  return (
    <nav
      aria-label="Programmes précédent et suivant"
      className="mt-16 grid gap-4 border-t border-foreground/10 pt-10 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          to="/charities/program/$slug"
          params={{ slug: previous.slug }}
          className="group rounded-2xl bg-muted p-6 ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            <ArrowLeftIcon className="size-3.5" /> Précédent
          </p>
          <p className="mt-2 font-bold text-foreground transition group-hover:text-catholic-red dark:group-hover:text-red-400">
            {previous.title}
          </p>
        </Link>
      ) : (
        <span aria-hidden className="hidden sm:block" />
      )}
      {next && (
        <Link
          to="/charities/program/$slug"
          params={{ slug: next.slug }}
          className="group rounded-2xl bg-muted p-6 text-right ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-lg sm:col-start-2"
        >
          <p className="flex items-center justify-end gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Suivant <ArrowRightIcon className="size-3.5" />
          </p>
          <p className="mt-2 font-bold text-foreground transition group-hover:text-catholic-red dark:group-hover:text-red-400">
            {next.title}
          </p>
        </Link>
      )}
    </nav>
  )
}
