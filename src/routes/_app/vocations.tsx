import { createFileRoute, Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import {
  ArrowRightIcon,
  BookOpenIcon,
  ChurchIcon,
  CompassIcon,
  CrossIcon,
  HeartHandshakeIcon,
  LandmarkIcon,
  MessageCircleIcon,
  PencilIcon,
  UsersIcon,
} from 'lucide-react'
import type { VocationsSelfTestResult } from '#/features/vocations/components/vocations-self-test.tsx'
import { VocationsSelfTest } from '#/features/vocations/components/vocations-self-test.tsx'
import { pageMetadata } from '#/utils/seo.ts'
import { Button, buttonVariants } from '#shared/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '#shared/components/ui/tooltip.tsx'
import { cn } from '#shared/lib/utils.ts'

const signs = [
  'La pensée vous revient — encore et encore — même quand vous croyiez l’avoir rangée dans un coin.',
  'Vous aimez la messe, l’adoration, le silence des églises. Et vous ne savez pas toujours expliquer pourquoi.',
  'On vous a déjà dit — une fois ou plusieurs — que vous feriez un bon prêtre.',
  'Vous cherchez moins une carrière qu’un sens, une mission, une manière d’être utile.',
  'L’idée du sacerdoce vous attire et vous fait peur en même temps. Vous vous sentez « pas digne ».',
  'Vous vous êtes surpris à penser : « et si c’était moi, à la place de ce prêtre ? »',
  'Votre foi vous a soutenu dans les épreuves, et vous voudriez la partager.',
  'Vous priez — ou vous aimeriez apprendre à prier.',
]

const selfTestResults: VocationsSelfTestResult[] = [
  {
    min: 0,
    title: 'Vous n’avez rien coché. C’est parfait comme ça.',
    message:
      'Le discernement commence dans le silence, pas dans les cases. Gardez simplement la question ouverte, et parlez-en à un prêtre de confiance quand vous le sentez.',
  },
  {
    min: 1,
    title: 'Quelque chose bouge.',
    message:
      'C’est peut-être le début d’un appel, peut-être autre chose. La meilleure façon de le savoir : en parler. Choisissez un prêtre que vous admirez et posez-lui la question.',
  },
  {
    min: 3,
    title: 'Les signes se précisent.',
    message:
      'Quand plusieurs signes se rejoignent, l’Église dit qu’il est temps d’écouter. Rencontrez l’Office des vocations : on vous écoutera, sans rien vous imposer.',
  },
  {
    min: 5,
    title: 'Il se passe quelque chose de sérieux.',
    message:
      'Ces signes méritent une vraie attention. Prenez rendez-vous avec le directeur des vocations. Cette page existe justement pour ce moment-là.',
  },
]

const paths = [
  {
    number: '01',
    icon: ChurchIcon,
    title: 'Le Presbytérat',
    question: 'Qu’est-ce qu’un prêtre ?',
    description:
      "Un homme baptisé, ordonné par l’évêque, appelé à servir le Christ et Son Église. Il donne sa vie pour guider les brebis fidèles et égarées, comme Jésus lui-même s'est donné en sacrifice pour la rémission de nos péchés.",
    dutiesLabel: 'Ce que fait le prêtre',
    duties: [
      "Annonce l'Évangile et prêche",
      'Administre et célèbre les 7 sacrements chrétiens (baptême, mariage, confession, onction des malades) ainsi que les funérailles',
      'Célèbre la messe et les liturgies quotidiennes',
      "Prêche, transmet et enseigne la foi de l'Église",
      "Guide, conseille et prend soin du Peuple de Dieu qui lui est confié par l'évêque",
    ],
    note: "Le prêtre s'engage au célibat et à l'obéissance",
    button: {
      label: 'Devenir prêtre',
      link: '/clergy-application',
      className: 'bg-black hover:bg-neutral-950',
    },
  },
  {
    number: '02',
    icon: HeartHandshakeIcon,
    title: 'Le Diaconat',
    question: 'Qu’est-ce qu’un diacre ?',
    description:
      '« Diakonia » signifie service. Ordonné pour servir, le diacre est le serviteur de la Parole, de la liturgie et de la charité et assiste les prêtres et les évêques.',
    dutiesLabel: 'Ce que fait le diacre',
    duties: [
      'Annonce l’Évangile et prêche',
      'Administre le baptême, bénit les mariages et préside les funérailles',
      "Distribue la communion lors de la messe et l'apporte aux personnes malades ou isolées",
      "Durant la messe : fait la lecture de l'Évangile et assiste les prêtres et les évêques",
      'Visite les prisonniers et les malades, aide les personnes dans le besoin. Au service de la Charité, il se rend proche des pauvres, des malades et des exclus.',
      "Se fait « yeux et oreilles » de l'évêque au sein de la communauté",
    ],
    note: 'Appelé à vivre au milieu de la cité, le diacre permanent peut se marier et exercer une activité professionnelle',
    button: {
      label: 'Devenir Diacre',
      link: '/clergy-application',
      className: 'bg-gray-500 hover:bg-gray-600',
    },
  },
  {
    number: '03',
    icon: CrossIcon,
    title: 'La vie religieuse et consacrée',
    question: 'Qu’est-ce qu’un religieux, une religieuse ?',
    description:
      "Un homme ou une femme qui donne sa vie entière à Dieu par les vœux de pauvreté, de chasteté et d’obéissance, au sein d’une congrégation ou d'un Ordre.",
    dutiesLabel: 'Ce que font religieux et religieuses',
    duties: [
      'Consacrent leur vie à la prière, au travail et au service, en conformité avec la mission et la vie prescrite par la Règle de leur communauté',
      'Vivent en communauté : dans un monastère, dans un couvent, une maison de congrégation',
      "Servent là où l'Église a besoin : enseignement, recherche, charité, soins médicaux, administration, activité missionnaire, aumônerie",
    ],
    note: 'Parmi les religieux, certains sont ordonnés prêtres',
    button: {
      label: 'Consacrer sa vie à Dieu',
      className: 'bg-amber-900 hover:bg-amber-950',
    },
  },
]

const discernmentSteps = [
  {
    icon: BookOpenIcon,
    title: 'Priez',
    description:
      'Parlez à Dieu comme à un ami. Asseyez-vous, taisez-vous, écoutez. Le silence dit souvent plus que mille raisons.',
  },
  {
    icon: MessageCircleIcon,
    title: 'Parlez-en',
    description:
      'À un prêtre que vous admirez, à un proche de confiance. Le premier pas est le plus difficile — et le plus important.',
  },
  {
    icon: CompassIcon,
    title: 'Rencontrez l’Office des vocations',
    description:
      'Le directeur des vocations vous écoute. Aucun engagement, aucune pression. Juste une conversation, sans jugement.',
  },
  {
    icon: LandmarkIcon,
    title: 'Faites confiance à l’Église',
    description:
      'Au bout du chemin, c’est l’Archevêque qui appelle au sacerdoce. L’Église discerne avec vous — pas à votre place.',
  },
]

export const Route = createFileRoute('/_app/vocations')({
  head: () => ({
    meta: pageMetadata('Vocations'),
  }),
  component: VocationsPage,
})

function VocationsPage() {
  return (
    <>
      <Hero />

      <VocareSection />

      <SignsSection />

      <PathsSection />

      <DiscernmentSection />

      <ClosingSection />
    </>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-linear-to-b from-black/70 via-black/60 to-black/85">
      <Image
        src="/assets/images/olacathedral-cross.webp"
        alt=""
        className="object-[50% 30%] absolute inset-0 h-full w-full object-cover"
        layout="fullWidth"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/85" />
      <div className="relative container mx-auto flex flex-col items-center px-4 pt-(--header-height) pb-24 text-center sm:px-6 lg:px-8">
        <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Office des vocations · Archidiocèse de Los Santos
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight text-balance text-white sm:text-6xl md:text-7xl xl:text-8xl">
          Vous êtes faits
          <br />
          <span className="bg-linear-135 from-[#f0c14b] to-[#b8860b] bg-clip-text text-transparent">
            pour plus.
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg/relaxed text-white/80 md:text-xl">
          La pensée vous revient, encore et encore. Vous la chassez, elle revient. Ce n’est
          peut-être pas un hasard. C’est peut-être un appel.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#signes"
            className={buttonVariants({
              variant: 'secondary',
              size: 'lg',
              className: 'h-12 px-8 text-base',
            })}
          >
            Faire le test des signes
          </a>
          <Link
            to="/contact"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className:
                'h-12 border-white/40 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white',
            })}
          >
            <PencilIcon /> Écrire à l’Office des vocations
          </Link>
        </div>
      </div>
    </section>
  )
}

function VocareSection() {
  return (
    <section className="bg-muted py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase dark:text-amber-400">
            Un mot latin
          </p>
          <p className="bg-linear-to-b from-[#f0c14b] to-[#a8740a] bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl md:text-9xl">
            VOCARE
          </p>
          <p className="mt-4 text-xl font-medium text-muted-foreground italic">« appeler »</p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl space-y-6 text-justify text-lg/relaxed text-muted-foreground md:text-xl/relaxed">
          <p>
            Vocation vient du latin <em>vocare</em> : <strong>appeler</strong>. Dieu vous appelle.
            Pas d’une manière vague, mais par votre nom, au milieu de votre vie telle qu’elle est —
            votre travail, vos doutes, vos joies, vos blessures.
          </p>
          <p>
            Une vocation n’est pas une ambition. L’ambition prend, elle se saisit d’un projet. La
            vocation donne : elle reçoit d’abord, dans le silence, puis elle se donne.
          </p>
          <blockquote className="border-l-4 border-amber-500 pl-6 text-muted-foreground italic">
            « Le disciple ne choisit pas sa route. Il reconnaît celle que le Maître lui ouvre. »
          </blockquote>
        </div>
      </div>
    </section>
  )
}

function SignsSection() {
  return (
    <section id="signes" className="scroll-mt-(--header-height) bg-zinc-950 py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            Discernement
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
            Peut-être que quelque chose vous parle déjà.
          </h2>
          <p className="mt-6 text-lg/relaxed text-white/70">
            Voici quelques signes que l’Église reconnaît chez ceux que Dieu appelle. Cochez ce qui
            vous ressemble. Soyez honnêtes — Lui, il sait déjà.
          </p>
        </div>

        <VocationsSelfTest signs={signs} results={selfTestResults} />

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-white/50">
          Ce petit test n’est qu’un début. Il ne remplace ni la prière, ni une conversation, ni
          l’accompagnement d’un prêtre.
        </p>
      </div>
    </section>
  )
}

function PathsSection() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase dark:text-amber-400">
            Trois chemins
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance text-foreground md:text-5xl">
            Où Dieu vous appelle-t-il&nbsp;?
          </h2>
          <p className="mt-6 text-lg/relaxed text-muted-foreground">
            Trois grandes routes s’offrent à qui veut se donner entièrement : le sacerdoce, la vie
            consacrée et le diaconat. Voici ce que chacune est — et ce qu’elle fait chaque jour.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paths.map(
            (
              {
                number,
                icon: Icon,
                title,
                question,
                description,
                dutiesLabel,
                duties,
                note,
                button,
              },
              index
            ) => (
              <article
                key={number}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl bg-muted p-8 ring-1 ring-foreground/10 transition hover:-translate-y-1 hover:shadow-xl',
                  index === 2 && 'md:col-span-2 lg:col-span-1'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-6xl font-extrabold text-amber-500/25 transition group-hover:text-amber-500/40">
                    {number}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 text-sm font-semibold text-amber-700 dark:text-amber-400">
                  {question}
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
                <p className="mt-6 text-xs font-semibold tracking-[0.25em] text-amber-700 uppercase dark:text-amber-400">
                  {dutiesLabel}
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {duties.map((duty) => (
                    <li key={duty} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500"
                        aria-hidden
                      />
                      <span>{duty}</span>
                    </li>
                  ))}
                </ul>
                <div className="min-h-6 flex-1" aria-hidden />
                <p className="min-h-[4.2rem] border-t border-foreground/10 pt-5 text-sm leading-relaxed text-muted-foreground italic">
                  {note}
                </p>
                {button.link ? (
                  <Link
                    to={button.link}
                    className={cn(buttonVariants({ size: 'lg' }), 'mt-10 py-7', button.className)}
                  >
                    {button.label}
                  </Link>
                ) : (
                  <Tooltip>
                    <TooltipTrigger
                      className="mt-10 py-7"
                      render={
                        <Button size="lg" className={button.className} disabled>
                          {button.label}
                        </Button>
                      }
                    />
                    <TooltipContent>
                      <p>Indisponible pour le moment. Prenez contact par téléphone.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </article>
            )
          )}
        </div>

        <article className="mt-6 flex flex-col gap-6 rounded-2xl border border-foreground/10 bg-card p-8 md:flex-row md:items-start md:gap-8">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UsersIcon className="size-6" />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground uppercase">
              Et le mariage&nbsp;?
            </p>
            <h3 className="mt-2 text-xl font-bold text-foreground">Une vocation à part entière</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Devenir époux, épouse, père ou mère : c’est bâtir l’Église domestique, la première
              cellule du Peuple de Dieu, là où la foi se transmet. Le mariage est une vocation — la
              plus répandue. Si votre appel se tourne vers le monde et la famille, c’est une route
              que Dieu bénit, et que l’Église accompagne avec la même attention.
            </p>
          </div>
        </article>
      </div>
    </section>
  )
}

function DiscernmentSection() {
  return (
    <section className="bg-zinc-900 py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            Le chemin
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
            Discerner, ce n’est pas deviner. C’est marcher.
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {discernmentSteps.map(({ icon: Icon, title, description }, index) => (
            <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
                  <Icon className="size-6" />
                </span>
                <span className="text-4xl font-extrabold text-white/10">{index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm/relaxed text-white/70">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function ClosingSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,167,44,0.15),transparent_60%)]" />
      <div className="relative container mx-auto flex flex-col items-center px-4 py-24 text-center sm:px-6 md:py-32 lg:px-8">
        <p className="mb-6 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Le premier pas
        </p>
        <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-white md:text-6xl">
          Il n’y a pas de mauvais pas.
        </h2>
        <p className="mt-8 max-w-2xl text-lg/relaxed text-white/70 md:text-xl">
          Écrire à l’Office des vocations ne vous engage à rien. Rester seul avec cette question,
          lui, vous engage à beaucoup.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/contact"
            className={buttonVariants({
              variant: 'secondary',
              size: 'lg',
              className: 'h-12 px-8 text-base',
            })}
          >
            <PencilIcon /> Écrire à l’Office des vocations
          </Link>
          <Link
            to="/parishes"
            className={cn(
              buttonVariants({
                variant: 'link',
                size: 'lg',
                className: 'h-12 px-6 text-base text-white/80 hover:text-white',
              })
            )}
          >
            Vous êtes appelé ailleurs&nbsp;? Découvrez nos paroisses{' '}
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
