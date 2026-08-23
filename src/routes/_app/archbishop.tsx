import { createFileRoute } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { pageMetadata } from '#/utils/seo.ts'
import FacebrowserIcon from '#shared/components/icons/facebrowser.tsx'
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

const archbishop = {
  portraitUrl: '/assets/images/cardinal_callahan_officiel_portrait.webp',
  coatOfArmsUrl: '/assets/images/cardinal_hennessy_coat_of_arms.webp',
  socials: {
    facebrowser: 'https://face-fr.gta.world/profile/cardinalhennessy',
  },
  biography: [
    'Le Cardinal Edmund Michael Hennessy a été nommé 6e archevêque de Los Santos le 26 juin 2026 par le pape Léon XIV. Il était précédemment archevêque de Saint Louis (Missouri) par Benoit XVI. Le Pape François le crée Cardinal lors du consistoire du 12 janvier 2014.',
    "Né un 14 septembre, il y a 63 ans à Providence dans le Rhode Island, il est le deuxième des quatre enfants de Margaret et Michael Hennessy. Il a un frère ainé, Patrick, une sœur cadette, Mary, et un frère cadet, Thomas. Il commence sa scolarité à l'école paroissiale Saint-Pierre de Providence, poursuit ses études secondaires à La Salle Academy puis entre au séminaire Our Lady of Providence.",
    "Ordonné prêtre à 25 ans pour l'archidiocèse de Providence, il sert deux paroisses comme vicaire puis rejoint Rome pour poursuivre une licence en théologie sacrée à l'Université pontificale Saint-Thomas-d'Aquin. Il enseigne au Collège pontifical nord-américain pendant deux ans, avant de retourner à Providence et être nommé curé de paroisse.",
    "A l'âge de 45 ans, il est nommé évêque auxiliaire de Providence par le Pape Benoit XVI et choisit comme devise épiscopale « Seigneur, où vas-tu ? » (Jn 13:36). A 50 ans, le Pape Benoit XVI le nomme par la suite archevêque de Saint-Louis, Missouri puis le pape François le crée Cardinal lors du consistoire de février de l'année suivante.",
    'A Rome, le Cardinal Hennessy est actuellement membre du dicastère pour le Clergé.',
    'En mai 2025, il participe comme cardinal-électeur au conclave qui élit le Pape Léon XIV.',
  ],
  heraldryDescription:
    "Parti, au premier d'azur à trois vols d'or, rangés deux et un, chacun sommé d'une rose du même ; au second, de sinople à la croix de gueules, à l'étoile de cinq rais d'or brochante sur la croisée, chargée d'un trèfle du champ",
}

export const Route = createFileRoute('/_app/archbishop')({
  head: () => ({
    meta: pageMetadata('Cardinal Edmund Hennessy'),
  }),
  component: ArchbishopPage,
})

function ArchbishopPage() {
  return (
    <>
      <Hero
        variant="minimal"
        title="Son Éminence le Cardinal Edmund Hennessy"
        subtitle="Cardinal de l'Église catholique et 6e archevêque de Los Santos"
        backgroundColor="bg-catholic-red/90"
      />
      <div className="container mx-auto space-y-6 px-4 pt-15 sm:px-6 lg:px-8">
        <h1 className="pb-15 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
          Son Éminence, le Cardinal Edmund Hennessy
          <br />
          Archevêque de Los Santos
        </h1>

        <section className="mb-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose max-w-none space-y-5 text-justify prose-neutral prose-p:text-base prose-p:leading-relaxed md:prose-p:text-lg [&>p:first-of-type]:mt-0">
              <div className="not-prose mx-auto mb-4 w-70 md:float-left md:mx-0 md:mr-6 md:w-90">
                <div className="relative aspect-2/3 overflow-hidden rounded-2xl shadow-lg ring-2 ring-catholic-red">
                  <Image
                    src={archbishop.portraitUrl}
                    alt="Portrait officiel de Son Éminence le Cardinal Edmund Hennessy"
                    layout="fullWidth"
                    className="object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              </div>
              {archbishop.biography.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="space-y-8 lg:sticky lg:top-6 lg:self-start">
            <Card className="overflow-hidden rounded-3xl border-border pt-0 shadow-sm">
              <CardHeader className="bg-catholic-red py-6">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-xl text-catholic-red-foreground">
                    Armoiries Ecclésiastiques
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 p-5 sm:p-8">
                <div className="flex justify-center">
                  <div className="relative h-64 w-64">
                    <Image
                      src={archbishop.coatOfArmsUrl}
                      alt="Armoiries de Son Éminence le Cardinal Edmund Hennessy"
                      layout="fullWidth"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <Separator className="bg-catholic-red" />
                <div className="space-y-3">
                  <h4 className="font-semibold text-catholic-red dark:text-red-400">
                    Description héraldique
                  </h4>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                    {archbishop.heraldryDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-neutral-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">Suivre Son Éminence</CardTitle>
                <CardDescription>
                  Retrouvez les dernières interventions et messages officiels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <a
                  href={archbishop.socials.facebrowser}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-12 w-full justify-start gap-3 text-base',
                  })}
                >
                  <FacebrowserIcon iconColor="#F5A800" />
                  Page Facebrowser
                </a>
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </>
  )
}
