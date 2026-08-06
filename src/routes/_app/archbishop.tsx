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
  coatOfArmsUrl: '/assets/images/cardinal_callahan_armoiries.webp',
  socials: {
    facebrowser: 'https://face-fr.gta.world/profile/cardinalcallahan',
  },
  biography: [
    "Le cardinal Ronan Callahan a été nommé 7e archevêque de Los Santos le 22 février 2025 par le pape François. Né le 26 janvier 1960 à Worcester dans le Massachusetts, il est le deuxième enfant de l'union de Seamus (1936-2005) et Bridget (1938-2015) Callahan, une famille irlandais-américaine immigrée dans l'est des États-Unis depuis le 19e siècle.",
    "Il commence ses études à l'école élémentaire catholique de la Sainte Famille (Holy Family Academy) de Gardner (Massachusetts), puis poursuit au lycée de Saint Jean (St John's High School) à Shrewsbury (Massachusetts) avant d'entrer au Séminaire Saint Jean à Boston et poursuivre ses études en vue d'être prêtre au Collège pontifical nord-américain à Rome.",
    "Il est ordonné prêtre en 1987 pour l'archidiocèse de Los Santos. Il est vicaire de paroisse de 1987 à 1989, puis curé d'une paroisse de 1989 à 1995. De 1995 à 2002, il est professeur au Séminaire Saint Jean à Boston.",
    "En 2002, il est nommé évêque auxiliaire de l'archidiocèse de Boston par le pape saint Jean-Paul II et reçoit la consécration épiscopale des mains du cardinal Bernard Law. En 2011, le pape Benoit XVI le nomme évêque de Bridport (Connecticut), puis en 2018, le pape François le transfert en Ohio comme Archevêque de Cincinnati.",
    "Lors du consistoire du 29 juin 2018, Sa Sainteté le Pape François le créé cardinal. A Rome, il est actuellement membre du Dicastère pour l'Évangélisation et du Dicastère pour la Culture et l'Éducation.",
    'En mai 2025, il participe au conclave qui élit le pape Léon XIV.',
    'Sa devise épiscopale est « Qui est semblable au Seigneur notre Dieu ? » (Ps 113:5)',
  ],
  heraldryDescription:
    "Parti : au premier d'azur à trois vols d'or, rangés deux et un, chacun sommé d'une rose d'or ; au second de sinople, au croissant d'argent en chef à dextre, à la harpe d'or en chef à senestre et à l'aigle éployé de gueules en pointe. Timbré de la croix archiépiscopale d'or à deux traverses, sommé du chapeau de cardinal de gueules à quinze houppes de même de chaque côté ; au listel d'argent chargé de la devise : QUIS UT DEUS.",
}

export const Route = createFileRoute('/_app/archbishop')({
  head: () => ({
    meta: pageMetadata('Cardinal Ronan Callahan'),
  }),
  component: ArchbishopPage,
})

function ArchbishopPage() {
  return (
    <>
      <Hero
        variant="minimal"
        title="Son Éminence le Cardinal Ronan Callahan"
        subtitle="Cardinal de l'Église catholique et 7e archevêque de Los Santos"
        backgroundColor="bg-catholic-red/90"
      />
      <div className="container mx-auto space-y-6 px-4 pt-15 sm:px-6 lg:px-8">
        <h1 className="pb-15 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
          Son Éminence, le Cardinal Ronan Callahan
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
                    alt="Portrait officiel de Son Éminence le Cardinal Ronan Callahan"
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
                      alt="Armoiries de Son Éminence le Cardinal Ronan Callahan"
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
