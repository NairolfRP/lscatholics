import { MapPinIcon, PhoneIcon } from 'lucide-react'
import { CHARITIES_CONTACT } from '#/features/catholic-charities/constants/programs.constants'
import { buttonVariants } from '#shared/components/ui/button'

const rows = [
  { icon: PhoneIcon, label: 'Téléphone', value: CHARITIES_CONTACT.phone },
  { icon: MapPinIcon, label: 'Adresse', value: CHARITIES_CONTACT.address },
]

export function CharitiesContactSection() {
  return (
    <section id="contact" className="scroll-mt-(--header-height) bg-catholic-blue py-24 md:py-28">
      <div className="container mx-auto grid items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
            Nous joindre
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-balance text-white md:text-5xl">
            Vous avez besoin d'aide&nbsp;?
            <br />
            <span className="text-amber-400">Nous sommes là.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg/relaxed text-white/80">
            Nos bénévoles et travailleurs sociaux sont prêts à intervenir. Aucune situation n'est
            trop petite ou trop complexe pour nous.
          </p>
          <a
            href={`tel:${CHARITIES_CONTACT.phone}`}
            className={buttonVariants({
              variant: 'secondary',
              size: 'lg',
              className: 'mt-8 h-12 px-8 text-base',
            })}
          >
            <PhoneIcon className="size-5" />
            Appeler le {CHARITIES_CONTACT.phone}
          </a>
        </div>
        <ul className="space-y-6">
          {rows.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-start gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-400">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                  {label}
                </p>
                <p className="mt-1 font-medium text-white">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
