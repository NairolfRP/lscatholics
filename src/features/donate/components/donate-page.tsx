import { DonateSidebar } from '#/features/donate/components/donate-sidebar.tsx'
import { DonateTabs } from '#/features/donate/components/donate-tabs.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'
import Hero from '#shared/layouts/app/components/hero.tsx'

export function DonatePage() {
  return (
    <>
      <Hero
        variant="image"
        imageSrc="/assets/images/donate-background.webp"
        imageAlt="Bannière de la page donation"
        imagePosition="50% 25%"
        size="md"
        title={<Typography variant="h1">Soutenir notre communauté</Typography>}
      />

      <section className="container mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="mt-8 grid grid-cols-1 items-start gap-5 pb-16 lg:grid-cols-5">
          <div className="flex flex-col gap-5 lg:col-span-3">
            <DonateTabs />
          </div>
          <div className="flex flex-col gap-5 lg:top-28 lg:col-span-2">
            <DonateSidebar />
          </div>
        </div>
      </section>
    </>
  )
}
