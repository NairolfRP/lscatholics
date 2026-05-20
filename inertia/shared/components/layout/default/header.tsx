import { cn } from '@/lib/utils'
import { Link } from '@adonisjs/inertia/react'
import { useWindowScroll } from '@/shared/hooks/use_window_scroll'
import { useUser } from '@/shared/hooks/use_user'
import Navigation from '@/shared/components/layout/default/navigation'
import LoginButton from '@/shared/components/layout/default/login-button'
import UserAccountMenu from '@/shared/components/layout/default/user-account-menu'
import MobileNavigation from '@/shared/components/layout/default/mobile-navigation'
import { Logo } from '@/shared/components/logo'

const SCROLL_THRESHOLD = 50

export default function Header() {
  const [{ y }] = useWindowScroll()
  const user = useUser()

  const isScrolled = typeof y === 'number' && y > SCROLL_THRESHOLD

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-99 text-primary-foreground pt-safe pl-safe pr-safe transition-all duration-500 ease-in-out',
        {
          'bg-catholic-purple/70 backdrop-blur-md shadow-md': isScrolled,
          'bg-transparent': !isScrolled,
        }
      )}
    >
      <div
        className={cn(
          'absolute top-0 left-0 w-full h-30 bg-linear-to-b from-black/50 to-transparent -z-10 transition-opacity duration-500',
          { 'opacity-0': isScrolled, 'opacity-100': !isScrolled }
        )}
      />
      <div className="flex w-full justify-between align-middle items-center lg:py-5 lg:px-10">
        <h1>
          <Link route="home">
            <Logo className="w-20 h-20" />
          </Link>
        </h1>

        <div className="flex lg:gap-4 items-center px-5 lg:p-0">
          <Navigation />

          {user ? <UserAccountMenu /> : <LoginButton />}

          <MobileNavigation />
        </div>
      </div>
    </header>
  )
}
