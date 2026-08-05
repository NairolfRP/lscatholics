import { ScrollTextIcon } from 'lucide-react'
import {
  RegisterParishionerBenefits,
} from '#/features/parishioner/components/register-parishioner-benefits.tsx'
import {
  RegisterParishionerForm,
} from '#/features/parishioner/components/register-parishioner-form.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function RegisterParishionerPage() {
  return (
    <>
      <Hero
        variant="split"
        backgroundColor="var(--color-primary)"
        imageSrc="/assets/images/church-service.webp"
        imagePosition="40% 50%"
        imageAlt="La cathédrale Notre-Dame-des-Saints de Los Santos"
        title={
          <Typography variant="h1">
            Devenez paroissien de
            <br />
            <span className="bg-linear-135 from-[#f0c14b] via-[#e0a83e] to-[#b8860b] bg-clip-text text-transparent">
              l'Archidiocèse de LS
            </span>
          </Typography>
        }
        subtitle="Nous sommes ravis que vous vous intéressiez à rejoindre notre famille de familles. L'enregistrement aide les paroisses de l'Archidiocèse de Los Santos à mieux vous servir et vous permet de rester en contact avec elles."
      >
        <a
          href="#register-parishioner-form"
          className={buttonVariants({ variant: 'secondary', size: 'lg' })}
        >
          <ScrollTextIcon /> M'enregistrer
        </a>
      </Hero>

      <section className="container mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Typography variant="h2">Pourquoi devenir paroissien ?</Typography>
          <p className="mt-3 text-muted-foreground">
            L'enregistrement de votre foyer est gratuit et ne prend que quelques minutes.
          </p>
        </div>
        <div className="mt-8 pb-12">
          <RegisterParishionerBenefits />
        </div>
      </section>

      <section
        id="register-parishioner-form"
        className="container mx-auto max-w-4xl scroll-mt-32 px-4 pb-16 sm:px-6 lg:px-8"
      >
        <RegisterParishionerForm />
      </section>
    </>
  )
}
