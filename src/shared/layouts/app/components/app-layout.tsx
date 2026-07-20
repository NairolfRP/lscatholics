import type { PropsWithChildren } from 'react'
import { Footer } from './footer'
import { Header } from './header'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
