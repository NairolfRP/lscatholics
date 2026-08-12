import { useNavigate, useSearch } from '@tanstack/react-router'
import { CheckCircle2Icon, CrossIcon, HeartHandshakeIcon, ShieldCheckIcon } from 'lucide-react'
import {
  PermanentDeaconStep,
} from '#/features/clergy-application/components/steps/permanent-deacon-step.tsx'
import { PriestStep } from '#/features/clergy-application/components/steps/priest-step.tsx'
import {
  TemporaryDeaconStep,
} from '#/features/clergy-application/components/steps/temporary-deacon-step.tsx'
import {
  CLERGY_APPLICATION_MAX_LENGTHS,
  CLERGY_ROLE,
  clergyRoleOptions,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  clergyApplicationFormOpts,
} from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '#shared/components/ui/field.tsx'
import { RadioGroup, RadioGroupItem } from '#shared/components/ui/radio-group.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'

const recruitmentConditions = [
  "Vous ne pouvez pas réutiliser un personnage déjà joué, à moins de pouvoir justifier un parcours réaliste et compatible avec l'ordination. Il est vivement recommandé de créer un nouveau personnage",
  "Votre personnage doit être un HOMME. Dans l'Église catholique, les femmes ne peuvent pas être ordonnées",
  'Votre personnage ne doit pas être marié et doit avoir rompu toute relation amoureuse / intime',
  "Votre personnage ne doit pas avoir d'activité professionnelle et ne doit pas être engagé dans un parti politique",
  `Votre personnage doit être âgé de minimum ${CLERGY_APPLICATION_MAX_LENGTHS.MIN_PRIEST_AGE} ans et, s’il est déjà ordonné, ne pas avoir plus de ${CLERGY_APPLICATION_MAX_LENGTHS.MAX_PRIEST_AGE} ans`,
  "L'âge de votre personnage doit être cohérent. Prenez en compte qu'on ne peut entrer au séminaire qu'à partir de 18 ans et les études durent minimum 7 ans avant d'être ordonné prêtre",
  "Votre personnage doit être compatible avec le rôle de prêtre et avoir une histoire cohérente (n'hésitez pas à demander si vous avez besoin d'aide)",
  "Votre personnage doit être uniquement légal. Créer un prêtre uniquement pour s'impliquer dans des affaires illégales est interdit",
  "Ne pas avoir l'intention de troller ou d'utiliser ce rôle RP pour de mauvaises raisons. Nous voulons jouer sérieusement, avec bienveillance, et nous amuser, sans aucune intention volontaire d’offenser les vrais croyants catholiques.",
]

const deaconRecruitmentConditions = [
  "Vous ne pouvez pas réutiliser un personnage déjà joué, à moins de pouvoir justifier un parcours réaliste et compatible avec l'ordination. Il est vivement recommandé de créer un nouveau personnage",
  "Votre personnage doit être un HOMME. Dans l'Église catholique, les femmes ne peuvent pas être ordonnées",
  `Votre personnage doit être âgé de minimum ${CLERGY_APPLICATION_MAX_LENGTHS.MIN_TEMPORARY_DEACON_AGE} ans (diacre temporaire), ${CLERGY_APPLICATION_MAX_LENGTHS.MIN_UNMARRIED_PERMANENT_DEACON_AGE} ans (diacre permanent célibataire) ou ${CLERGY_APPLICATION_MAX_LENGTHS.MIN_MARRIED_PERMANENT_DEACON_AGE} ans (diacre permanent marié)`,
  "Votre personnage doit être compatible avec le rôle de diacre. Par exemple, il ne doit pas exercer une activité professionnelle contraire à la morale de l'Église (n'hésitez pas si vous avez des doutes ou des questions)",
  "Votre personnage doit être uniquement légal. Créer un diacre uniquement pour s'impliquer dans des affaires illégales est interdit",
  "Ne pas avoir l'intention de troller ou d'utiliser ce rôle RP pour de mauvaises raisons. Nous voulons jouer sérieusement, avec bienveillance, et nous amuser, sans aucune intention volontaire d’offenser les vrais croyants catholiques.",
]

export function ClergyApplicationPage() {
  const navigate = useNavigate({ from: '/clergy-application' })
  const { role } = useSearch({ from: '/_app/clergy-application' })
  const { isLoading, currentCharacter } = useGameContext()

  const form = useAppForm({
    formId: 'clergy-application-submission-form',
    ...clergyApplicationFormOpts({
      firstname: currentCharacter?.firstname,
      lastname: currentCharacter?.lastname,
    }),
  })

  return (
    <>
      <Hero
        variant="minimal"
        size="md"
        backgroundColor="bg-linear-to-b from-zinc-900 to-zinc-950"
        title={
          <Typography variant="h1">
            <strong className="font-semibold text-amber-400">((</strong> Rejoindre le clergé{' '}
            <strong className="font-semibold text-amber-400">))</strong>
          </Typography>
        }
        subtitle={
          <p>
            Le processus pour rejoindre la faction comme membre du clergé est en partie{' '}
            <strong className="font-semibold text-amber-400">OOC</strong>. Cela permet d'accompagner
            les joueurs dans la création de leurs personnages et de veiller à ce que le rôle ne soit
            pas détourné dans du troll/de mauvaises intentions.
          </p>
        }
      />

      <div className="border-b bg-muted">
        <div className="container mx-auto max-w-4xl px-2 py-10">
          <FieldSet>
            <FieldLegend
              className="mt-3 mb-10 border-b pb-5 text-center font-extrabold tracking-tight text-balance text-foreground data-[variant=legend]:text-4xl md:data-[variant=legend]:text-5xl"
              required
            >
              Quel <span className="text-amber-700 dark:text-amber-400">rôle</span> voulez-vous{' '}
              <span className="text-amber-700 dark:text-amber-400">jouer</span> ?
            </FieldLegend>
            <RadioGroup
              name="role"
              value={role}
              onValueChange={(selected) => {
                void navigate({ search: { role: selected }, resetScroll: false })
              }}
            >
              {clergyRoleOptions.map((clergyRole) => {
                const radioGroupId = `form-clergy-application-role-${clergyRole.value}`
                return (
                  <FieldLabel key={clergyRole.value} htmlFor={radioGroupId}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="text-xl font-bold tracking-tight text-balance">
                          {clergyRole.label}
                        </FieldTitle>
                      </FieldContent>
                      <RadioGroupItem id={radioGroupId} value={clergyRole.value} />
                    </Field>
                  </FieldLabel>
                )
              })}
            </RadioGroup>
          </FieldSet>
        </div>
      </div>

      {role != null ? (
        <>
          {role === CLERGY_ROLE.PRIEST && (
            <>
              <PriestSection />
              <PriestStep form={form} isLoading={isLoading} />
            </>
          )}
          {(role === CLERGY_ROLE.DEACON_TEMPORARY || role === CLERGY_ROLE.DEACON_PERMANENT) && (
            <>
              <DeaconSection />
              {role === CLERGY_ROLE.DEACON_TEMPORARY ? (
                <TemporaryDeaconStep form={form} isLoading={isLoading} />
              ) : (
                <PermanentDeaconStep form={form} isLoading={isLoading} />
              )}
            </>
          )}
        </>
      ) : null}
    </>
  )
}

function PriestSection() {
  return (
    <section className="border-b bg-background py-19 md:py-27">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <CrossIcon className="size-7" />
              </span>
              <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-amber-700 uppercase dark:text-amber-400">
                Le presbytérat
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-foreground md:text-5xl">
                Le prêtre
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                Le <strong>prêtre</strong> est un membre du <strong>bas-clergé</strong> qui est
                ordonné au <strong>second degré</strong> du sacrement de l’<strong>Ordre</strong>.
                Il est le collaborateur de l’évêque dans l’enseignement de la foi, l’administration
                des sacrements et le soin pastoral à la communauté.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <Card className="rounded-2xl">
              <CardContent className="space-y-6 p-7">
                <h3 className="text-lg font-bold text-foreground">
                  Il existe deux catégories de prêtres
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      Le prêtre <strong className="text-foreground">diocésain</strong>{' '}
                      <em>(formellement appelé « séculier »)</em>, incardiné à un (archi)diocèse,
                      est affecté dans les paroisses ou dans le gouvernement de l’évêque.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      Le prêtre <strong className="text-foreground">religieux</strong>{' '}
                      <em>(formellement appelé « régulier »)</em>, ordonné pour une communauté ou un
                      ordre religieux, a pour rôle avant tout de délivrer les sacrements et de
                      célébrer la messe pour sa propre communauté.
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  Dans le cas de notre faction, il sera surtout question des{' '}
                  <strong className="text-foreground">prêtres diocésains</strong>.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-6 p-7">
                <h3 className="text-lg font-bold text-foreground">
                  Lors de leur ordination, les prêtres diocésains s'engagent&nbsp;:
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong className="text-foreground">
                        Au Célibat et à la Chasteté&nbsp;:
                      </strong>{' '}
                      ils ne peuvent pas se marier, avoir de relations sexuelles et entretenir toute
                      relation amoureuse, intime ou ambiguë
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong className="text-foreground">À l’obéissance&nbsp;:</strong> ils
                      reconnaissent l’autorité de leur évêque (archevêque, dans le cas de Los
                      Santos) et promettent de lui être fidèle.
                    </span>
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  Contrairement aux prêtres religieux, le prêtre diocésain ne{' '}
                  <strong>fait pas vœu de pauvreté</strong>. Il peut{' '}
                  <strong>posséder un compte bancaire à son nom</strong>, faire ses{' '}
                  <strong>propres dépenses et achats</strong> (acquérir un bien, une voiture, ...),
                  tant que son mode de vie respecte les enseignements de l'Église et ne met pas en
                  danger son image.
                </p>
                <p className="text-muted-foreground">
                  Le prêtre diocésain ne peut pas avoir d'activité professionnelle, puisqu'il dédie
                  sa vie au service de l'Église et au soin de la communauté. C'est l'Église qui lui
                  verse une compensation financière pour l'aider à subvenir à ses besoins (logement,
                  nourriture, ...).
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-6 p-7">
                <h3 className="text-lg font-bold text-foreground">
                  Le rôle du prêtre est très vaste, mais il comprend notamment&nbsp;:
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      La célébration des sacrements : administrer le baptême, célébrer le mariage,
                      donner l'onction des malades et entendre les confessions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      La célébration des funérailles et autres sacramentaux (bénédictions d'objets,
                      de voiture ou de lieu, bénédictions de personnes, ...)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Célébrer la messe et les autres liturgies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      Enseigner et transmettre la foi et la morale dans sa paroisse ou son aumônerie
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      S’occuper et aider la communauté qui lui est confiée : il est comme un berger
                      qui prend soin de ses brebis, particulièrement les plus vulnérables et les
                      exclus
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Accomplir les missions que l’évêque peut lui donner</span>
                  </li>
                </ul>
                <p className="text-muted-foreground">
                  Quand un prêtre est mis à la tête d’une paroisse, il est appelé{' '}
                  <strong className="text-foreground">curé</strong>. Quand il assiste un curé de
                  paroisse, il est appelé <strong className="text-foreground">vicaire</strong>. Le
                  prêtre peut aussi être affecté à une aumônerie (auprès des prisonniers, des
                  étudiants, dans un hôpital ou dans une institution telle que le LSPD/LSFD/Sénat ou
                  autre).
                </p>
                <p className="text-muted-foreground">
                  Le prêtre peut évoluer et intégrer le gouvernement de l’archevêque. Il peut
                  remplir des postes vacants et notamment devenir le vicaire général / modérateur de
                  la curie, c'est-à-dire le bas-droit de l’archevêque.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-500/30 bg-amber-500/5">
              <CardContent className="space-y-4 p-7">
                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <ShieldCheckIcon className="size-5 text-amber-600 dark:text-amber-400" />
                  Conditions de recrutement
                </h3>
                <ul className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {recruitmentConditions.map((condition) => (
                    <li key={condition} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500"
                        aria-hidden
                      />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <strong>
                    Il n’est pas nécessaire d’être expert en religion. Si vous savez roleplay un
                    personnage social, vous savez RP un prêtre
                  </strong>
                  . Nous cherchons simplement des joueurs qui veulent jouer et s’amuser dans cet
                  univers. Si vous avez des questions ou besoin d’aide, nous serons toujours là pour
                  vous aider à pratiquer votre RP&nbsp;!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function DeaconSection() {
  return (
    <section className="bg-zinc-950 py-19 md:py-27">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400">
                <HeartHandshakeIcon className="size-7" />
              </span>
              <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
                Le diaconat
              </p>
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
                Le diacre
              </h2>
              <p className="mt-6 leading-relaxed text-white/70">
                Le <strong>diacre</strong> est un membre du <strong>bas-clergé</strong> ordonné au{' '}
                <strong>premier degré</strong> du sacrement de l’<strong>Ordre</strong>. Tandis que
                le prêtre assiste l’évêque dans l’enseignement de la foi et le soin pastoral, le
                diacre <strong>assiste</strong> l’évêque dans la mission : la{' '}
                <strong>charité</strong> et la
                <strong>fraternité</strong> dans la communauté.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <Card className="rounded-2xl border-white/10 bg-white/5">
              <CardContent className="space-y-6 p-7">
                <h3 className="text-lg font-bold text-white">Le diacre est soit&nbsp;:</h3>
                <ul className="space-y-4 text-white/70">
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-white">Temporaire&nbsp;:</strong> c'est un séminariste
                      en chemin pour devenir prêtre. Le diaconat n'est pour lui qu'une première
                      étape temporaire en vue du sacerdoce. Il jongle alors entre le service
                      diaconale, qui le nourrit d'une expérience ministérielle, et ses études au
                      séminaire
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong className="text-white">Permanent&nbsp;:</strong> un homme ordonné
                      diacre qui n'a pas vocation à devenir prêtre. Contrairement au prêtre et au
                      diacre temporaire, il peut se marier et posséder une activité professionnelle
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-white/10 bg-white/5">
              <CardContent className="space-y-6 p-7">
                <h3 className="text-lg font-bold text-white">
                  Le rôle du diacre est notamment&nbsp;:
                </h3>
                <ul className="space-y-4 text-white/70">
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Serviteur de l'Église</strong>&nbsp;: Il assiste les prêtres et les
                      évêques et participe activement à la vie des communautés
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Ministre de la Parole</strong>&nbsp;: Il proclame (c'est-à-dire fait
                      la lecture) l'Évangile durant la messe et peut prêcher
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Serviteur de l'Autel et Ministre de la Communion</strong>&nbsp;: Il
                      peut distribuer l'hostie et le vin, préalablement consacrés par un prêtre,
                      soit durant la messe soit directement auprès des malades et personnes isolées.
                      Il assiste notamment les prêtres et les évêques lors des célébrations
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Ministre du baptême, des mariages et des funérailles</strong>&nbsp;:
                      Il peut administrer le baptême et le sacrement de mariage, ainsi que présider
                      les funérailles
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Serviteur de la Charité</strong>&nbsp;: Il met son action au service
                      de la charité et de la compassion. Il visite et accompagne les plus
                      nécessiteux, les souffrants et les exclus : pauvres, malades, prisonniers,
                      marginalisés ...
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <HeartHandshakeIcon className="mt-0.5 size-5 shrink-0 text-amber-400" />
                    <span>
                      <strong>Yeux et oreilles de l'Archevêque</strong>&nbsp;: Appelé à vivre au
                      milieu de la communauté et à entretenir un lien de serviteur, et non
                      d'autorité, avec les habitants et les fidèles, il informe l'Archevêque et
                      l'Église sur la réalité de ce que les gens vivent
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-400/20 bg-amber-400/5">
              <CardContent className="space-y-4 p-7">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <ShieldCheckIcon className="size-5 text-amber-400" />
                  Conditions de recrutement
                </h3>
                <ul className="space-y-3 text-sm leading-relaxed text-white/70">
                  {deaconRecruitmentConditions.map((condition) => (
                    <li key={condition} className="flex items-start gap-3">
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400"
                        aria-hidden
                      />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm leading-relaxed text-white/70">
                  <strong>
                    Il n’est pas nécessaire d’être expert en religion. Si vous savez roleplay un
                    personnage social, vous savez RP un diacre
                  </strong>
                  . Nous cherchons simplement des joueurs qui veulent jouer et s’amuser dans cet
                  univers. Si vous avez des questions ou besoin d’aide, nous serons toujours là pour
                  vous aider à pratiquer votre RP&nbsp;!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
