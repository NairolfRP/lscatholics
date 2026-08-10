import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { LogInIcon, MenuIcon, XIcon } from 'lucide-react'
import { Logo } from '#/shared/components/logo'
import { ThemeModeToggle } from '#/shared/components/theme-mode-toggle'
import { Button } from '#/shared/components/ui/button'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Spinner } from '#/shared/components/ui/spinner'
import { toast } from '#/shared/components/ui/toast'
import UserMenu from '#/shared/components/user-menu'
import { useIsScrolled } from '#/shared/hooks/use-is-scrolled'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { cn } from '#/shared/lib/utils'
import Navigation, { MobileNavigation } from './navigation'

const SCROLL_THRESHOLD = 50

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false)
  const isScrolled = useIsScrolled(SCROLL_THRESHOLD) && !mobileNavOpen

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-40 m-auto pt-safe pr-safe pl-safe text-primary-foreground transition-all duration-500 ease-in-out',
          {
            'bg-primary/70 shadow-md backdrop-blur-md': isScrolled,
            'bg-transparent shadow-none': !isScrolled,
          }
        )}
      >
        <div
          className={cn(
            'absolute top-0 left-0 -z-10 h-(--header-height) w-full bg-linear-to-b from-black/50 to-transparent transition-opacity duration-500',
            { 'opacity-0': isScrolled }
          )}
        />

        <div className="min-w-[79.813rem]:container mx-auto">
          <div className="flex w-full items-center justify-between align-middle lg:px-10 lg:py-5">
            <div className="shrink-0">
              <Link to="/">
                <Logo width={80} height={80} loading="eager" />
              </Link>
            </div>

            <div className="flex min-w-0 items-center px-5 lg:gap-4 lg:p-0">
              <Navigation />

              <Account />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                aria-expanded={mobileNavOpen}
                aria-controls="mobile-navigation"
                aria-label={
                  mobileNavOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
                }
                className="size-inherit mx-5 p-2 min-[65.875rem]:hidden"
              >
                {mobileNavOpen ? (
                  <XIcon className="size-5 min-[17.688rem]:size-8" />
                ) : (
                  <MenuIcon className="size-5 min-[17.688rem]:size-8" />
                )}
              </Button>

              <ThemeModeToggle />
            </div>
          </div>
        </div>
      </header>

      <MobileNavigation open={mobileNavOpen} setOpen={setMobileNavOpen} />
    </>
  )
}

function Account() {
  const [loading, setLoading] = useState(false)
  const { data: session, isPending, error } = authClient.useSession()

  if (isPending) {
    return <Skeleton className="h-8 w-36" />
  }

  const user = session?.user

  if (user && !error) {
    return <UserMenu username={user.name} />
  }

  return (
    <Button
      variant="ghost"
      aria-label="Se connecter"
      className="size-inherit text-sm uppercase"
      disabled={loading}
      onClick={() => {
        setLoading(true)
        void authClient.signIn.social(
          {
            provider: 'gtaw',
            callbackURL: window.location.href,
            errorCallbackURL: window.location.href,
          },
          {
            onError: (ctx) => {
              toast.error(ctx.error.message)
              setLoading(false)
            },
          }
        )
      }}
    >
      {loading ? (
        <Spinner data-icon="inline-start" />
      ) : (
        <LogInIcon className="size-4 min-[17.688rem]:size-8 min-[28.063rem]:size-4" />
      )}
      <span className="hidden min-[28.063rem]:block min-[65.813rem]:hidden min-[76.063rem]:block">
        {loading ? <>Connexion...</> : <>Connexion</>}
      </span>
    </Button>
  )
}
