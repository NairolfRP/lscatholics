import type { PropsWithChildren } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import {
  ChurchIcon,
  GraduationCapIcon,
  HeartHandshakeIcon,
  School2Icon,
  UsersRoundIcon,
} from 'lucide-react'
import { buttonVariants } from '#shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card'
import { Separator } from '#shared/components/ui/separator'
import { Typography } from '#shared/components/ui/typography'
import { ARCHDIOCESAN_NB_OF_FAITHFUL } from '#shared/constants/archdiocese'
import Hero from '#shared/layouts/app/components/hero'

export const Route = createFileRoute('/_app/about')({
  component: AboutUsPage,
})

function AboutUsPage() {
  const formattedNbOfFaithful = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(ARCHDIOCESAN_NB_OF_FAITHFUL)
  const formattedNbOfEnrolledStudents = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(73750)

  return (
    <>
      <Hero
        variant="image"
        title={
          <Typography variant="h1">
            <span className="bg-linear-135 from-[#daa520] to-[#b8860b] bg-clip-text text-transparent">
              Nous Sommes
            </span>
            <br />
            Une <span className="text-primary">Famille</span> de{' '}
            <span className="text-catholic-purple dark:text-catholic-purple-light">Familles</span>
          </Typography>
        }
        subtitle={
          <p className="mx-auto block max-w-3xl text-xl font-light text-white drop-shadow md:text-2xl">
            Quatre millions de catholiques. Une Cité de Saints. Nous sommes le Peuple de Dieu de
            l'Archidiocèse de Los Santos.
          </p>
        }
        imageSrc="/assets/images/olacathedral-cross.webp"
        imagePosition="50% 1%"
      />
      <section className="bg-catholic-purple py-16 text-catholic-purple-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div>
              <div className="mb-1 text-4xl font-bold text-amber-500">
                <ChurchIcon className="mx-auto size-9 text-inherit" />
              </div>
              <div className="mb-2 text-4xl font-bold text-amber-500">288</div>
              <div className="font-medium text-catholic-purple-foreground">Paroisses</div>
            </div>
            <div>
              <div className="mb-1 text-4xl font-bold text-amber-500">
                <UsersRoundIcon className="mx-auto size-9 text-inherit" />
              </div>
              <div className="mb-2 text-4xl font-bold text-amber-500">{formattedNbOfFaithful}</div>
              <div className="font-medium text-catholic-purple-foreground">Fidèles catholiques</div>
            </div>
            <div>
              <div className="mb-1 text-4xl font-bold text-amber-500">
                <School2Icon className="mx-auto size-9 text-inherit" />
              </div>
              <div className="mb-2 text-4xl font-bold text-amber-500">265</div>
              <div className="font-medium text-catholic-purple-foreground">
                Écoles et lycées catholiques
              </div>
            </div>
            <div>
              <div className="mb-1 text-4xl font-bold text-amber-500">
                <GraduationCapIcon className="mx-auto size-9 text-inherit" />
              </div>
              <div className="mb-2 text-4xl font-bold text-amber-500">
                {formattedNbOfEnrolledStudents}+
              </div>
              <div className="font-medium text-catholic-purple-foreground">Étudiants inscrits</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col justify-between gap-12 md:flex-row-reverse">
            <div>
              <figure>
                <Image
                  src="/assets/images/2025-christmas-mass-prayer.webp"
                  layout="constrained"
                  alt="People of God praying in Cathedral at Christmas Mass 2025"
                  width={600}
                  height={600}
                  loading="lazy"
                  className="shadow-sm"
                />
                <figcaption className="mx-auto max-w-100 pt-3 text-center text-base leading-relaxed font-thin text-muted-foreground italic md:text-lg">
                  « Cette cité est le Corps du Christ… Voilà le Christ tout entier : le Christ uni à
                  l’Église. »<br /> - <strong>Saint Augustin</strong>
                </figcaption>
              </figure>
            </div>
            <div>
              <h2 className="mb-4 text-3xl font-bold uppercase md:text-4xl">Notre Mission</h2>
              <Separator className="mx-auto mb-6 h-1 w-24 bg-catholic-gold" />
              <div className="mx-auto prose prose-lg max-w-4xl text-justify leading-7">
                <p>
                  Nous, le Peuple de Dieu de l'Archidiocèse de Los Santos, recevons notre mission de
                  poursuivre l'oeuvre rédemptrice de Jésus-Christ. Baptisés dans le Corps du Christ,
                  confirmés dans l'Esprit Saint, nourris par la Parole et l'Eucharistie, nous
                  partageons la mission du Christ, comme prêtres, prophètes et rois-serviteurs. Nous
                  formons un seul corps avec l'Église catholique à travers le monde, en communion
                  avec le Pape.
                </p>
                <p>
                  Sous l'autorité pastorale de notre{' '}
                  <Link to="/archbishop" className="p-0 text-primary underline">
                    Archevêque
                  </Link>
                  , nous collaborons ensemble pour vivre et annoncer l'Évangile. Le Christ a
                  proclamé le règne de Dieu. Nous sommes appelés à en être les instruments dans le
                  monde. Nous nous engageons à bâtir une communauté de foi et d'amour.
                </p>
                <p>
                  Avec le Christ, nous portons la Bonne Nouvelle aux pauvres. Nous nous engageons à
                  combattre la pauvreté sous toutes ses formes, qu'elle soit spirituelle, économique
                  ou morale.
                </p>
                <p>
                  Avec le Christ, nous affirmons les liens qui nous unissent. Nous nous engageons à
                  abattre les murs qui divisent.
                </p>
                <p>
                  Nous consacrons nos paroisses, nos écoles, nos institutions, nos services et nos
                  organisations à cette mission, sous la tendre protection de Marie, Reine des
                  Saints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex h-100 items-center bg-neutral-50 bg-[url(/assets/images/thanksgiving2024.webp)] bg-position-[top_50%_right_50%] py-5 text-white sm:bg-position-[top_55%_right_35%] md:bg-position-[top_60%_right_30%] lg:bg-position-[top_60%_right_50%]">
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 container mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 xl:flex-row">
            <div className="max-w-4xl space-y-5">
              <h2 className="border-b border-secondary text-2xl font-bold text-secondary uppercase md:text-5xl">
                Notre impact
              </h2>
              <p className="md:text-lg">
                Avec Catholic Charities, nous venons en aide à des millions d'enfants, de personnes
                âgées, de familles, d'hommes et de femmes, de migrants, de sans-abri et autres
                populations vulnérables, dans les comtés de Los Santos, de Ventura et de Santa
                Barbara.
              </p>
            </div>
            <Link
              to="/charities"
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
                className: 'md:h-21 md:gap-2 md:px-11 md:text-xl md:font-bold',
              })}
            >
              <HeartHandshakeIcon className="size-6" /> Devenir bénévole
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold uppercase md:text-4xl">Notre Histoire</h2>
            <Separator className="mx-auto mb-6 h-1 w-24 bg-catholic-gold" />
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Des premiers missionnaires espagnols à la formation du plus vaste et plus peuplé
              diocèse des États-Unis, découvrez l'histoire d'un archidiocèse nommé en l'honneur de
              la Sainte Vierge Marie et des Saints.
            </p>
          </div>

          <div className="relative ml-4 space-y-12 border-l-2 border-border pb-8 md:ml-12">
            <HistoryMilestone milestoneTitle="1781-1840" title="Les origines de l'Archidiocèse">
              <p>
                L'<strong>Archidiocèse de Los Santos</strong>, officiellement élevé comme
                archidiocèse en 1936, est l'aboutissement de plusieurs siècles d'évolution de la
                présence catholique romaine dans les <strong>San Andreas</strong> (Haute et
                Basse-San Andreas). Son origine remonte aux missionnaires espagnols arrivés dans la
                région à la fin du XVII<sup>e</sup> siècle et au XVIII<sup>e</sup> siècle pour
                explorer la région et, sous la direction du frère franciscain (et désormais saint)
                Junípero Serra, fonder les premières missions.
              </p>
              <p>
                Plus tard, les colons furent encouragés à migrer vers le nord depuis le Mexique. Le
                14 septembre 1781, sur l'actuelle rue de Popular Street, dans le centre de Los
                Santos, fut officiellement fondé « <strong>El Pueblo del Río de Porciúncula</strong>{' '}
                », plus connu sous le nom de <strong>Pueblo de Nuestra Señora de los Santos</strong>
                .
              </p>
              <p>
                Dès sa fondation, la ville annonçait déjà la diversité qui allait caractériser Los
                Santos. Parmi les 44 premiers colons, seuls deux étaient d'origine européenne tandis
                que les autres étaient autochtones, latino-américains, noirs et métissés.
              </p>
              <p>
                Le Pueblo de Nuestra Señora de los Santos fut intégré au territoire paroissial de la{' '}
                <strong>Mission San Gabriel</strong>. À mesure que Los Santos évolua pour devenir
                une ville en 1835 puis une grande métropole diversifiée, l'Église se transforma
                également pour répondre à l'accroissement de la population et à la proclamation
                officielle de San Andreas comme État.
              </p>
            </HistoryMilestone>

            <HistoryMilestone milestoneTitle="1840" title="Premier diocèse">
              <p>
                Les origines de l'Église dans les San Andreas remontent en réalité à 1681. La
                juridiction spirituelle sur la <strong>Basse-San Andreas</strong>, qui correspondait
                à l'actuelle péninsule mexicaine, ainsi que sur la région appelée alors{' '}
                <strong>Haute-San Andreas</strong>, était contestée. Les évêques mexicains de
                Guadalajara et de Durango revendiquaient tous les deux cette autorité. Finalement,
                la juridiction fut attribuée à l'évêque de Guadalajara.
              </p>
              <p>
                Dès 1760, il fut suggéré d'élever en diocèses les provinces intérieures du
                nord-ouest de la Nouvelle-Espagne. Le 7 mai 1779, sur recommandation des espagnoles
                de Madrid, le pape Pie VI érigea le <strong>diocèse de Sonora</strong> et définit
                son territoire sur les provinces de Sonora, de Sinaloa et des deux San Andreas.
                Cependant, le territoire était si grand que les communications étaient rares. Et, en
                pratique, l'Église de Haute-San Andreas dépendait principalement des missionnaires
                dans les affaires religieuses et administratives.
              </p>
              <p>
                Après plusieurs décennies de propositions et de projets successifs, le{' '}
                <strong>diocèse des Deux San Andreas</strong> fut érigé le 27 avril 1840 par le Pape
                Grégoire XVI par la bulle pontificale <em>Apostolicam sollicitudinem</em> avec pour
                territoire la Basse-San Andreas et la Haute-San Andreas.
              </p>
            </HistoryMilestone>

            <HistoryMilestone milestoneTitle="1849" title="Diocèse de Monterey">
              <p>
                Après la guerre américano-mexicaine, la Haute-San Andreas fut cédée aux États-Unis
                en 1848 et le diocèse des Deux San Andreas fut renommé{' '}
                <strong>diocèse de Monterey</strong>.
              </p>
              <p>
                Le changement de souveraineté, la création du territoire américain de San Andreas,
                son admission comme État en 1850 ainsi que les objections du gouvernement mexicain
                concernant l'autorité d'un évêque américain sur la Basse-San Andreas péninsulaire
                rendirent nécessaire une nouvelle définition des frontières du diocèse.
              </p>
            </HistoryMilestone>

            <HistoryMilestone
              milestoneTitle="1853"
              title="Création de l'Archidiocèse de San Fierro"
            >
              <p>
                Le 17 avril 1853, M<sup>gr</sup> Joseph Alemany, évêque de Monterey, fut informé que
                la péninsule de Basse-San Andreas avait été séparée du diocèse de Monterey. Le 29
                juillet 1853, le pape Pie IX érigea une nouvelle province métropolitaine avec pour
                siège <strong>San Fierro</strong>. La limite méridionale de la paroisse de San José
                fut fixée comme frontière entre le nouvel{' '}
                <strong>archidiocèse de San Fierro</strong> et le diocèse de Monterey, qui
                conservait alors l'ensemble du sud de San Andreas.
              </p>
            </HistoryMilestone>

            <HistoryMilestone milestoneTitle="1859" title="Diocèse de Monterey-Los Santos">
              <p>
                En 1859, le siège épiscopal fut déplacé à Los Santos et le diocèse prit alors le nom
                de <strong>diocèse de Monterey-Los Santos</strong>.
              </p>
              <p>
                Bien que les sources historiques de l'Archidiocèse de Los Santos révèlent que des
                discussions ont eu lieu presque immédiatement entre San Andreas et le Saint-Siège au
                sujet de nouvelles réorganisations territoriales, le diocèse de Monterey-Los Santos
                demeura inchangé jusqu'en 1922.
              </p>
            </HistoryMilestone>

            <HistoryMilestone milestoneTitle="1922" title="Diocèse de Los Santos-San Diego">
              <p>
                En 1922, Mg<sup>r</sup> John Cantwell, évêque de Monterey-Los Santos, demanda que le
                territoire du diocèse, qui couvrait alors près de 233 000km², soit réorganisé : les
                douze comtés au nord du comté de Santa Barbara devaient rester attachés à Monterey,
                tandis que les comtés méridionaux constitueraient le nouveau diocèse de Los
                Santos-San Diego.
              </p>
              <p>
                Le pape Pie XI approuva le plan de Mg<sup>r</sup> Cantwell. En juin 1922 le diocèse
                de Monterey-Fresno fut érigé tandis que le diocèse de Los Santos-San Diego couvrait
                toute la partie sud de San Andreas jusqu'à la frontière mexicaine.
              </p>
            </HistoryMilestone>

            <HistoryMilestone milestoneTitle="1936" title="Élévation en Archidiocèse">
              <p>
                En juillet 1936, une nouvelle province métropolitaine fut créée avec pour siège Los
                Santos. Les quatre comtés les plus au sud furent séparés pour former le diocèse de
                San Diego.
              </p>
              <p>
                La province ecclésiastique de Los Santos, nouvellement créée, comprenait les évêchés
                suffragants de Monterey-Fresno, San Diego et Tucson. Le territoire de l'Archidiocèse
                de Los Santos comprenait quant à lui les comtés d'Orange, de Los Santos, de Ventura
                et de Santa Barbara.
              </p>
              <p>
                En 1948, afin d'éviter toute confusion avec l'ancien archidiocèse mexicain de
                Puebla, la juridiction prit officiellement le nom d'
                <strong>Archidiocèse de Los Santos en San Andreas</strong>.
              </p>
              <p>
                M<sup>gr</sup> John Joseph Cantwell devint le premier{' '}
                <strong>archevêque de Los Santos</strong>.
              </p>
            </HistoryMilestone>

            <HistoryMilestone
              milestoneTitle="1976-1983"
              title="Dernière réorganisation territoriale"
            >
              <p>
                La juridiction territoriale fut maintenue jusqu'en 1976, lorsque le comté d'Orange
                fut séparé du territoire archidiocésain pour former le nouveau diocèse d'Orange.
              </p>
              <p>
                Puis, en 1978, les comtés de Riverside et San Bernardino furent séparés du diocèse
                de San Diego pour former le diocèse de San Bernardino. D'autres diocèses du nord de
                San Andreas et de l'Arizona furent également réorganisés durant cette période.
              </p>
            </HistoryMilestone>

            <HistoryMilestone
              milestoneTitle="Aujourd'hui"
              title="Le plus large archidiocèse des États-Unis"
            >
              <p>
                Aujourd'hui, l'<strong>Archidiocèse de Los Santos</strong> couvre la partie
                méridionale de l'État de San Andreas. Il comprend les comtés de{' '}
                <strong>Los Santos</strong>, <strong>Ventura</strong> et{' '}
                <strong>Santa Barbara</strong>. Son territoire s'étend des limites septentrionales
                du comté de Santa Barbara, près de la ville de Santa Maria, jusqu'à la côte sud de
                l'île du comté de Los Santos et couvre une superficie de 22 430 kilomètres carrés.
              </p>
              <p>
                L'archidiocèse compte <strong>288 paroisses</strong> réparties dans{' '}
                <strong>120 villes</strong>. En 2005, la population catholique romaine s'élevait à{' '}
                <strong>4 349 267</strong> sur une population totale de 11 258 600 habitants.
              </p>
              <p>
                Il comprend également 30 missions et chapelles, ainsi que 16 églises catholiques de
                rite oriental. Son réseau scolaire est l'un des plus vastes de San Andreas (tant
                public que privé) avec 214 écoles élémentaires et 51 lycées catholiques.
              </p>
              <p>
                Riche de son environnement culturel très diversifié, l'archidiocèse célèbre la messe
                dans plus de 42 langues et propose des services pastoraux adaptés à 72 groupes
                ethniques.
              </p>
            </HistoryMilestone>
          </div>
        </div>
      </section>
    </>
  )
}

function HistoryMilestone({
  children,
  milestoneTitle,
  title,
}: PropsWithChildren<{ milestoneTitle: string; title: string }>) {
  return (
    <div className="relative pl-8 md:pl-0">
      <div className="absolute top-1.5 -left-2.25 h-4 w-4 rounded-full bg-secondary ring-4 ring-neutral-50 md:hidden" />
      <div className="items-start md:grid md:grid-cols-5 md:gap-8">
        <div className="relative col-span-1 hidden flex-col items-end pt-1 md:flex">
          <div className="absolute top-1.5 -right-6.25 z-10 h-4 w-4 rounded-full bg-secondary ring-4 ring-neutral-50" />
          <span className="text-xl font-bold text-secondary">{milestoneTitle}</span>
        </div>
        <Card className="gap-3 rounded-xl bg-card shadow-sm md:col-span-4">
          <CardHeader>
            <span className="block text-lg font-bold text-secondary md:hidden">
              {milestoneTitle}
            </span>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-7 text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
