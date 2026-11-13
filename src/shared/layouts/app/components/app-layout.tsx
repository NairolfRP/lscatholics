import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import { BottomNavigation } from './bottom-navigation'
import { Footer } from './footer'
import { Header } from './header'

export function AppLayout({ children }: PropsWithChildren) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col pb-20 min-[90rem]:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Aller au contenu principal
      </a>

      <Header mobileNavOpen={mobileNavOpen} setMobileNavOpen={setMobileNavOpen} />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <BottomNavigation open={mobileNavOpen} onOpenMenu={() => setMobileNavOpen(true)} />
    </div>
  )
}
