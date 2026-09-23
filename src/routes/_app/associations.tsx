import type { ReactNode } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRightIcon,
  BookOpenTextIcon,
  ChurchIcon,
  ExternalLinkIcon,
  UsersIcon,
} from 'lucide-react'
import { privateAssociations, publicAssociations } from '#/config/associations.ts'
import { pageMetadata } from '#/utils/seo.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'
import { cn } from '#shared/lib/utils.ts'
import type { AssociationEntry } from '#shared/types/association.types.ts'

const columns =
  'md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.85fr)_minmax(0,1.7fr)] md:gap-x-6'

export const Route = createFileRoute('/_app/associations')({
  head: () => ({
    meta: pageMetadata('Associations de fidèles', {
      metadata: {
        description:
          "Registre des associations privées et publiques de fidèles ayant reçues une personnalité juridique en droit de l'Église dans l'Archidiocèse de Los Santos",
      },
    }),
  }),
  component: AssociationsPage,
})

function AssociationsPage() {
  return (
    <>
      <Hero
        variant="minimal"
        title="Associations de fidèles"
        backgroundColor="bg-linear-to-r from-catholic-purple to-catholic-blue"
        subtitle="Le registre des associations privées et publiques de fidèles ayant reçues une personnalité juridique en droit de l'Église dans l'Archidiocèse de Los Santos."
      />

      <section className="container mx-auto max-w-7xl px-4 pt-12 pb-20 sm:px-6 lg:px-8">
        <Intro />

        <RegisterSection
          title="Associations privées de fidèles"
          countLabel={{ singular: 'reconnue par l’Église', plural: 'reconnues par l’Église' }}
          entries={privateAssociations}
        />

        <RegisterSection
          title="Associations publiques de fidèles"
          countLabel={{ singular: 'érigée par l’Église', plural: 'érigées par l’Église' }}
          entries={publicAssociations}
        />
      </section>
    </>
  )
}

function Intro() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        Qu’est-ce qu’une association de fidèles&nbsp;?
      </h2>
      <p className="mt-5 leading-relaxed text-muted-foreground">
        Le droit de l’Église décrit les « associations de fidèles » comme des structures dont les
        membres tendent « par un agir commun à favoriser une vie plus parfaite, à promouvoir le
        culte public ou la doctrine chrétienne, ou à exercer d’autres activités d’apostolat, à
        savoir des activités d’évangélisation, des œuvres de piété ou de charité, et l’animation de
        l’ordre temporel par l’esprit chrétien » (can. 298, § 1).
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        Ces associations peuvent avoir l’une de ces deux formes&nbsp;:
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-muted p-6 ring-1 ring-foreground/10">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UsersIcon className="size-5" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-foreground">Associations privées</h3>
          <p className="mt-2 text-sm/relaxed text-muted-foreground">
            Initiative de fidèles qui agit et s’exprime en propre nom et non au nom de l’Église.
            Elle se gouverne librement, selon ses statuts, et possède elle-même ses biens. Pour être
            reconnue par l’Église et recevoir un conseiller spirituel, elle doit soumettre une
            lettre de supplique à l’autorité ecclésiastique compétente.
          </p>
        </div>
        <div className="rounded-2xl bg-muted p-6 ring-1 ring-foreground/10">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ChurchIcon className="size-5" />
          </span>
          <h3 className="mt-4 text-lg font-bold text-foreground">Associations publiques</h3>
          <p className="mt-2 text-sm/relaxed text-muted-foreground">
            Érigées par l’autorité ecclésiastique compétente, elles poursuivent une mission
            officielle au nom de l’Église. Contrairement à l’association privée, l'association
            publique est « propriété » de l’Église (les biens de l'association sont ceux de l'Église
            et l'autorité ecclésiastique nomme/confirme son dirigeant et rédige ses statuts).
          </p>
        </div>
      </div>

      <aside className="mt-6 rounded-xl border-l-4 border-amber-500 bg-muted p-5 text-sm/relaxed text-muted-foreground">
        <p className="font-semibold text-foreground">À noter</p>
        <p className="mt-1">
          Aucune association de fidèles ne peut « prendre le nom de “catholique” sans le
          consentement de l’autorité ecclésiastique compétente » (can. 300).
        </p>
      </aside>
    </div>
  )
}

function RegisterSection({
  title,
  countLabel,
  entries,
}: {
  title: string
  countLabel: { singular: string; plural: string }
  entries: AssociationEntry[]
}) {
  return (
    <section className="mt-16">
      <header className="mb-6 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-secondary uppercase">Registre</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground uppercase">
          {title}
        </h2>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {entries.length} association{entries.length > 1 ? 's' : ''}{' '}
          {entries.length > 1 ? countLabel.plural : countLabel.singular}
        </p>
      </header>

      <RegisterTable entries={entries} />
    </section>
  )
}

function RegisterTable({ entries }: { entries: AssociationEntry[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
      <div
        className={cn(
          'hidden border-b border-border bg-background/50 px-6 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase md:grid',
          columns
        )}
      >
        <span>Nom</span>
        <span>Lien</span>
        <span>Téléphone</span>
        <span>Adresse</span>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <BookOpenTextIcon className="size-6 text-muted-foreground/50" />
          <p className="mt-1 max-w-md text-sm/relaxed text-muted-foreground">
            Aucune association enregistrée dans cette catégorie pour le moment.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className={cn('grid grid-cols-1 gap-x-6 gap-y-2 px-6 py-5 md:items-start', columns)}
            >
              <EntryName name={entry.name} />
              <Field label="Lien">
                {entry.link ? <EntryLink href={entry.link} /> : <Missing />}
              </Field>
              <Field label="Téléphone">
                {entry.phone ? <a href={`tel:${entry.phone}`}>{entry.phone}</a> : <Missing />}
              </Field>
              <Field label="Adresse postale">
                {entry.address ? <span>{entry.address}</span> : <Missing />}
              </Field>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="block text-xs font-medium tracking-wide text-muted-foreground md:hidden">
        {label}
      </span>
      <div className="mt-0.5 text-sm/relaxed text-muted-foreground md:mt-0">{children}</div>
    </div>
  )
}

function EntryName({ name }: { name: string }) {
  return <span className="font-semibold text-foreground md:pt-0.5">{name}</span>
}

function EntryLink({ href }: { href: string }) {
  if (href.startsWith('/')) {
    return (
      <Link
        to={href}
        className="inline-flex items-center gap-1.5 font-medium text-primary transition hover:underline"
      >
        Voir le lien <ArrowRightIcon className="size-3.5" />
      </Link>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-medium text-primary transition hover:underline"
    >
      Voir le lien <ExternalLinkIcon className="size-3.5" />
    </a>
  )
}

function Missing() {
  return <span className="text-muted-foreground/60">—</span>
}
