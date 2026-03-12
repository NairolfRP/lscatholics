import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import { Typography } from '@/shared/components/ui/typography'
import HeroSection from '@/shared/components/layout/default/hero-section'
import FacebrowserIcon from '@/shared/components/svg/facebrowser'
import ArchbishopPortrait from '@/assets/images/cardinal_callahan_officiel_portrait.webp'
import CoatOfArms from '@/assets/images/cardinal_callahan_armoiries.webp'

export default function ArchbishopPage() {
  return (
    <>
      <Head title="Cardinal Callahan" />

      <HeroSection bgColor="bg-catholic-red" py="24">
        <h1 className="text-5xl md:text-6xl mb-4 font-bold font-serif">Cardinal Callahan</h1>
        <p className="text-lg md:text-xl text-white/80 opacity-90 leading-relaxed italic">
          Cardinal de l'Église catholique et 7e archevêque de Los Santos
        </p>
      </HeroSection>

      <div className="py-20">
        <div className="container flex flex-col gap-15 max-w-7xl mx-auto px-4">
          <section>
            <Typography variant="h2" className="border-none pb-10 text-4xl font-bold">
              Son Éminence, le cardinal Ronan Callahan, archevêque de Los Santos
            </Typography>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col space-y-5 md:w-80 md:flex-shrink-0 items-center md:items-start">
                <img
                  src={ArchbishopPortrait}
                  alt="Portrait officiel du Cardinal Callahan"
                  className="max-h-110 mx-auto object-contain"
                />

                <a
                  href="https://facebrowser.gta.world/CardinalCallahan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-auto w-auto"
                >
                  <Button className="bg-[#D15454] hover:bg-[#D15454]/90 cursor-pointer w-full">
                    <FacebrowserIcon />
                    Cardinal Callahan sur Facebrowser
                  </Button>
                </a>
              </div>

              <div className="flex-1">
                <Typography className="text-justify">
                  Le cardinal Ronan Callahan a été nommé 7e archevêque de Los Santos le 22 février
                  2025 par le pape François. Né le 26 janvier 1960 à Worcester dans le
                  Massachusetts, il est le deuxième enfant de l'union de Seamus (1936-2005) et
                  Bridget (1938-2015) Callahan, une famille irlandais-américaine immigrée dans l'est
                  des États-Unis depuis le 19e siècle.
                </Typography>
                <Typography className="text-justify">
                  Il commence ses études à l'école élémentaire catholique de la Sainte Famille (Holy
                  Family Academy) de Gardner (Massachusetts), puis poursuit au lycée de Saint Jean
                  (St John's High School) à Shrewsbury (Massachusetts) avant d'entrer au Séminaire
                  Saint Jean à Boston et poursuivre ses études en vue d'être prêtre au Collège
                  pontifical nord-américain à Rome.
                </Typography>
                <Typography className="text-justify">
                  Il est ordonné prêtre en 1987 pour l'archidiocèse de Los Santos. Il est vicaire de
                  paroisse de 1987 à 1989, puis curé d'une paroisse de 1989 à 1995. De 1995 à 2002,
                  il est professeur au Séminaire Saint Jean à Boston.
                </Typography>
                <Typography className="text-justify">
                  En 2002, il est nommé évêque auxiliaire de l'archidiocèse de Boston par le pape
                  saint Jean-Paul II et reçoit la consécration épiscopale des mains du cardinal
                  Bernard Law. En 2011, le pape Benoit XVI le nomme évêque de Bridport
                  (Connecticut), puis en 2018, le pape François le transfert en Ohio comme
                  Archevêque de Cincinnati.
                </Typography>
                <Typography className="text-justify">
                  Lors du consistoire du 29 juin 2018, Sa Sainteté le Pape François le créé
                  cardinal. A Rome, il est actuellement membre du Dicastère pour l'Évangélisation et
                  du Dicastère pour la Culture et l'Éducation.
                </Typography>
                <Typography className="text-justify">
                  En mai 2025, il participe au conclave qui élit le pape Léon XIV.
                </Typography>
                <Typography className="text-justify">
                  Sa devise épiscopale est « Qui est semblable au Seigneur notre Dieu ? » (Ps 113:5)
                </Typography>
              </div>
            </div>
          </section>

          <section>
            <Typography
              variant="h3"
              className="uppercase border-b border-[#D15454] mb-10 text-3xl font-bold"
            >
              Armoiries
            </Typography>

            <img
              src={CoatOfArms}
              alt="Armoiries du Cardinal Callahan"
              className="md:float-right max-h-90 md:max-h-70 mx-auto md:mx-0"
            />

            <Typography className="text-justify">
              Comme le veut la tradition héraldique de l'Église, les armoiries d'un archevêque se
              composent de deux parties :
            </Typography>
            <Typography variant="list" className="my-0">
              <li>
                d'une part, les <strong>armes de l'archidiocèse de Los Santos</strong>, qui
                apparaissent à dextre (côté gauche pour le spectateur) ;
              </li>
              <li>
                d'autre part, les <strong>armes personnelles du prélat</strong>, qui figurent à
                senestre (côté droit pour le spectateur).
              </li>
            </Typography>
            <Typography className="text-justify [&:not(:first-child)]:mt-4 mb-6">
              Ce parti d'écu exprime l'union spirituelle et pastorale entre l'évêque et l'Église
              locale confiée à sa sollicitude.
            </Typography>

            <Typography variant="list" className="my-0">
              <li>
                <strong>À dextre :</strong> sur fond d'azur, trois paires d'ailes d'or, chacune
                accompagnée d'une rose stylisée. Ces insignes représentent l'Archidiocèse de Los
                Santos. Les ailes évoquent le nom de la cité placée sous le patronage des anges,
                tandis que les roses rappellent la tradition spirituelle et mariale propre à la
                région.
              </li>
              <li>
                <strong>À senestre :</strong> sur fond de sinople, une harpe d'or, un croissant
                d'argent et un aigle de gueules. Ces armoiries personnelles expriment l'identité du
                Cardinal : la harpe souligne son héritage irlandais, le croissant d'argent rappelle
                l'Immaculée Conception, patronne des États-Unis, et l'aigle rouge symbolise les
                origines américaines de sa famille dans l'Est du pays.
              </li>
            </Typography>

            <Typography className="text-justify">
              Les ornements qui entourent l'écu sont ceux réservés aux cardinaux de la Sainte Église
              romaine :
            </Typography>
            <Typography variant="list" className="my-0">
              <li>
                le <strong>chapeau galero de gueules</strong>, orné de quinze houppes de chaque côté
                ;
              </li>
              <li>
                la <strong>croix archiépiscopale à double traverse</strong>, signe de sa dignité
                métropolitaine.
              </li>
            </Typography>

            <Typography className="text-justify">
              Au bas de l'écu, un listel d'argent porte la devise de Son Éminence :{' '}
              <em>« Quis ut Deus »</em> (« Qui est semblable au Seigneur notre Dieu ? »), tirée du
              Psaume 112:5.
            </Typography>

            <div className="clear-both" />
          </section>
        </div>
      </div>
    </>
  )
}
