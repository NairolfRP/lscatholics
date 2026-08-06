import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { ArrowRightIcon, Building2Icon, PhoneIcon, UserRoundIcon } from 'lucide-react'
import { departments } from '#/config/departments.ts'
import { getDepartmentBySlug } from '#/utils/department.ts'
import type { ResolvedDepartment } from '#/utils/department.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { buttonVariants } from '#shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card'
import { Separator } from '#shared/components/ui/separator'
import Hero from '#shared/layouts/app/components/hero.tsx'
import { cn } from '#shared/lib/utils.ts'
import type {
  Department,
  DepartmentCategory,
  DepartmentId,
  DepartmentTeam,
  DepartmentTeamMember,
} from '#shared/types/department.types.ts'

const categoryTitles: Record<DepartmentCategory, string> = {
  curia: 'La Curie',
  services: 'Services et Opérations',
  charities: 'Charités',
}

export const Route = createFileRoute('/_app/department/$slug')({
  loader: ({ params }) => {
    const department = getDepartmentBySlug(params.slug)

    if (!department) {
      throw notFound()
    }

    return department
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? pageMetadata(loaderData.title, {
          metadata: { description: loaderData.description },
        })
      : undefined,
  }),
  component: DepartmentDetailPage,
})

function DepartmentDetailPage() {
  const department = Route.useLoaderData()
  const { page } = department

  const related = departments
    .filter((dep) => dep.id !== department.id && dep.category === department.category)
    .sort((a, b) => (a.shortTitle ?? a.title).localeCompare(b.shortTitle ?? b.title, 'fr'))

  return (
    <>
      <DepartmentHero department={department} />

      <div className="container mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8">
        <nav aria-label="Fil d'Ariane">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/" className="transition hover:text-foreground">
                Accueil
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/departments" className="transition hover:text-foreground">
                Départements
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              {department.title}
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <div className="max-w-3xl space-y-6 text-justify text-lg/relaxed text-muted-foreground">
              {page.content ? (
                page.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)
              ) : (
                <p>{department.description}</p>
              )}
            </div>

            <section className="mt-16">
              <div className="mb-12 flex items-center bg-secondary py-6">
                <h2 className="px-6 text-2xl font-bold text-secondary-foreground uppercase sm:px-10">
                  Notre équipe
                </h2>
              </div>

              <DirectorSection director={page.director} />

              {page.teams?.map((team) => (
                <TeamSection key={team.title} team={team} />
              ))}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
            <ContactCard director={page.director} />

            {related.length > 0 && (
              <RelatedDepartmentsCard
                items={related}
                categoryTitle={categoryTitles[department.category]}
              />
            )}

            <ActionsCard departmentId={department.id} />
          </aside>
        </div>
      </div>
    </>
  )
}

function DepartmentHero({ department }: { department: ResolvedDepartment }) {
  const banner = department.page.banner

  if (banner?.image) {
    return (
      <Hero
        variant="image"
        size="sm"
        imageSrc={banner.image}
        imageAlt=""
        imagePosition="50% 15%"
        title={department.title}
        subtitle={department.description}
      />
    )
  }

  if (banner?.color) {
    return (
      <Hero
        variant="minimal"
        size="sm"
        backgroundColor={banner.color}
        title={department.title}
        subtitle={department.description}
      />
    )
  }

  return (
    <Hero
      variant="image"
      size="sm"
      imageSrc="/assets/images/cathedralTower.webp"
      imageAlt=""
      imagePosition="50% 15%"
      title={department.title}
      subtitle={department.description}
    />
  )
}

function DirectorSection({ director }: { director: DepartmentTeamMember }) {
  return (
    <div className="flex flex-col items-center gap-8 pb-16 md:flex-row md:items-center md:gap-10">
      {director.image ? (
        <div className="relative aspect-2/3 w-52 shrink-0 overflow-hidden rounded-2xl shadow-lg ring-2 ring-catholic-red">
          <Image
            src={director.image}
            alt={director.name ? `Portrait de ${director.name}` : 'Portrait du directeur'}
            layout="fullWidth"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          aria-hidden
          className="h-78 w-52 shrink-0 rounded-2xl bg-linear-to-b from-secondary to-amber-800"
        />
      )}
      <div>
        <p className="text-sm font-bold tracking-wide text-catholic-red uppercase dark:text-red-400">
          Direction
        </p>
        <h3 className="mt-1 text-3xl font-bold uppercase">{director.name || 'Poste vacant'}</h3>
        <p className="mt-1 font-semibold text-secondary">{director.position || 'N/A'}</p>
        {director.phone && (
          <div className="mt-5">
            <p className="text-sm font-bold text-secondary uppercase">Téléphone</p>
            <span className="mt-1 flex items-center gap-2 text-muted-foreground">
              <PhoneIcon className="size-4" /> {director.phone}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function TeamSection({ team }: { team: DepartmentTeam }) {
  return (
    <div className="pb-16">
      <h3 className="text-xl font-bold text-secondary uppercase">{team.title}</h3>
      {team.members.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {team.members.map((member, index) => (
            <article
              key={index}
              className="flex flex-col overflow-hidden rounded-xl bg-card shadow-xs ring-1 ring-foreground/10"
            >
              <div
                className={cn(
                  'flex min-h-60 flex-col justify-end bg-cover bg-center p-5',
                  !member.image && 'bg-linear-to-b from-secondary to-amber-950'
                )}
                style={member.image ? { backgroundImage: `url(${member.image})` } : undefined}
              >
                <h4 className="text-xl leading-4 font-bold text-white">
                  {member.name || 'VACANT'}
                </h4>
                <p className="mt-1 font-medium text-secondary">{member.position}</p>
              </div>
              <div className="flex-1 p-5">
                <h5 className="text-base font-bold text-secondary uppercase">Téléphone</h5>
                <span className="mt-1 flex items-center gap-2">
                  <PhoneIcon className="size-4" /> {member.phone || '700'}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-muted-foreground italic">
          Aucun membre dans l'équipe pour le moment.
        </p>
      )}
    </div>
  )
}

function ContactCard({ director }: { director: DepartmentTeamMember }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Contact du service</CardTitle>
        <CardDescription>Coordonnées du responsable et de son équipe.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-4">
          {director.image ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-catholic-red">
              <Image
                src={director.image}
                alt={director.name ? `Portrait de ${director.name}` : 'Portrait du directeur'}
                layout="fullWidth"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UserRoundIcon className="size-7" />
            </span>
          )}
          <div className="min-w-0">
            <p className="font-semibold">{director.name || 'Poste vacant'}</p>
            <p className="text-sm text-muted-foreground">{director.position}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <PhoneIcon className="size-4" />
          </span>
          <div>
            <p className="text-xs font-bold text-secondary uppercase">Téléphone</p>
            <p className="font-medium">{director.phone ?? '700'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function RelatedDepartmentsCard({
  items,
  categoryTitle,
}: {
  items: Department[]
  categoryTitle: string
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Autres départements</CardTitle>
        <CardDescription>{categoryTitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((department) => (
          <Link
            key={department.id}
            to="/department/$slug"
            params={{ slug: department.slug }}
            className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-muted"
          >
            <span>{department.shortTitle ?? department.title}</span>
            <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}

function ActionsCard({ departmentId }: { departmentId: DepartmentId }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-3">
        <Link
          to="/careers"
          search={{ department: departmentId }}
          className={buttonVariants({ variant: 'default', className: 'h-11 w-full gap-2' })}
        >
          <Building2Icon className="size-4" /> Rejoindre l'équipe
        </Link>
        <Link
          to="/departments"
          className={buttonVariants({ variant: 'outline', className: 'h-11 w-full gap-2' })}
        >
          Tous les départements
        </Link>
      </CardContent>
    </Card>
  )
}
