import { useState } from 'react'
import { HandHeart, House, Menu } from 'lucide-react'
import { router } from '@inertiajs/react'
import Logo from '@/assets/images/logo.png'
import { MENU_ITEMS } from '@/shared/constants/menu.constants'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import { Button } from '@/shared/components/ui/button'
import { urlFor } from '@/lib/client'

export default function MobileNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = (route: string, routeParams?: Record<string, any>) => {
    router.visit(urlFor(route as any, routeParams))
    setMobileMenuOpen(false)
  }

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger className="lg:hidden py-5 px-10" asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-8" />
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-primary-500 text-primary-foreground z-100 w-full h-full pb-20 overflow-y-scroll pt-safe pl-safe pr-safe">
        <SheetHeader>
          <SheetTitle>
            <img alt="Logo" src={Logo} className="w-20 h-20" />
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <ul className="flex flex-col gap-10">
          <li>
            <a
              onClick={() => handleNavigate('home')}
              className="mobile-navigation-item-title flex gap-2 items-center cursor-pointer"
            >
              <House /> Accueil
            </a>
          </li>

          <Accordion type="single" collapsible className="flex flex-col gap-10">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <AccordionItem value={`mobile-nav-${item.id}-submenu`}>
                    <AccordionTrigger className="mobile-navigation-item-title">
                      {item.label}
                    </AccordionTrigger>
                    <AccordionContent className="bg-primary pl-5 flex flex-col gap-5 mt-3 py-4">
                      {item.children.map((subItem) => {
                        if (subItem.route) {
                          return (
                            <a
                              key={subItem.id}
                              onClick={() => handleNavigate(subItem.route!, subItem.routeParams)}
                              className="text-base pl-3 cursor-pointer"
                            >
                              {subItem.label}
                            </a>
                          )
                        }
                        if (subItem.href) {
                          return (
                            <a
                              key={subItem.id}
                              href={subItem.href}
                              target={subItem.target}
                              className="text-base pl-3"
                            >
                              {subItem.label}
                            </a>
                          )
                        }
                        return <span key={subItem.id}>{subItem.label}</span>
                      })}
                    </AccordionContent>
                  </AccordionItem>
                ) : item.route ? (
                  <a
                    onClick={() => handleNavigate(item.route!, item.routeParams)}
                    className="mobile-navigation-item-title block cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    target={item.target}
                    className="mobile-navigation-item-title block"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </Accordion>

          <li className="px-5">
            <Button
              variant="secondary"
              className="mobile-navigation-item-title w-full"
              onClick={() => handleNavigate('donate.index')}
            >
              <HandHeart /> Faire un don
            </Button>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  )
}
