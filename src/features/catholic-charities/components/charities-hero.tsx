import { Image } from '@unpic/react'
import { ArrowDownIcon, HandHeartIcon } from 'lucide-react'
import { buttonVariants } from '#shared/components/ui/button'

const stats = [
  { value: '1919', label: 'Année de fondation' },
  { value: '3', label: 'Comtés desservis' },
  { value: '7', label: "Programmes d'aide" },
]

export function CharitiesHero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden bg-[#170a0d]">
      <Image
        src="/assets/images/catholic-charities-hero.webp"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
        layout="fullWidth"
        fetchPriority="high"
        decoding="async"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#170a0d] via-[#170a0d]/75 to-black/40" />
      <div className="relative container mx-auto flex flex-col px-4 pt-(--header-height) pb-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase backdrop-blur">
            <HandHeartIcon className="size-4" />
            Le bras social de l'Archidiocèse
          </p>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-balance text-white sm:text-6xl md:text-7xl xl:text-8xl">
            Catholic
            <br />
            <span className="bg-linear-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              Charities
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg/relaxed font-medium text-white/85 md:text-xl">
            Inspirés par l'Évangile, nous servons toute personne dans le besoin — quelle que soit sa
            foi, son origine ou sa situation.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#programmes"
              className={buttonVariants({
                variant: 'secondary',
                size: 'lg',
                className: 'h-12 px-8 text-base',
              })}
            >
              Découvrir nos programmes
            </a>
            <a
              href="#participer"
              className={buttonVariants({
                variant: 'outline',
                size: 'lg',
                className:
                  'h-12 border-white/40 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white',
              })}
            >
              Comment participer
            </a>
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="text-3xl font-extrabold text-amber-300 md:text-4xl">{value}</dd>
                <dd className="mt-1 text-xs font-semibold tracking-widest text-white/70 uppercase">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <a
        href="#programmes"
        aria-label="Descendre vers les programmes"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 transition hover:text-white md:block"
      >
        <ArrowDownIcon className="size-6 animate-bounce" />
      </a>
    </section>
  )
}
