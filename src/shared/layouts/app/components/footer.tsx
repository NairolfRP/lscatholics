import { Link } from '@tanstack/react-router'
import { MapPinIcon, PhoneIcon } from 'lucide-react'
import { Typography } from '#/shared/components/ui/typography'
import { socials } from '#/shared/constants/socials'
import { footerNavItems } from '../constants/nav.constants'

export function Footer() {
  return (
    <footer className="laptop:px-20 bg-catholic-purple px-5 pb-safe text-catholic-purple-foreground">
      <div className="container mx-auto py-12">
        <div className="mobile:grid-cols-2 grid gap-8 md:grid-cols-4">
          {footerNavItems.map((item) => (
            <div key={item.label}>
              <Typography variant="h4" className="mb-4">
                {item.label}
              </Typography>
              <ul className="space-y-3 text-sm">
                {item.children?.map((subItem) => (
                  <li key={subItem.label}>
                    <Link
                      to={subItem.to}
                      target={subItem.target}
                      className="opacity-80 transition-colors hover:text-catholic-gold hover:opacity-100"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <Typography variant="h4" className="mb-4">
              Contact
            </Typography>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPinIcon className="mt-1.5 h-4 w-4 shrink-0 text-catholic-gold" />
                <div>
                  <p className="flex flex-col font-medium">
                    <span>Cathédrale Notre-Dame-des-Saints</span>
                    <span className="opacity-80">Ginger Street, Little Seoul</span>
                    <span className="opacity-80">Los Santos, SA 90010</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="h-4 w-4 shrink-0 text-catholic-gold" />
                <span className="opacity-80">700</span>
              </div>
            </div>
            <div className="mt-7 flex justify-center gap-3 md:justify-start">
              {Object.entries(socials).map(([socialId, social]) => {
                if (
                  social.metadata &&
                  (social.metadata.exclude?.includes('footer') ||
                    (social.metadata.only && !social.metadata.only.includes('footer')))
                ) {
                  return null
                }

                const SocialIcon = social.icon

                return (
                  <a
                    key={socialId}
                    href={social.href}
                    title={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-catholic-gold md:size-8"
                  >
                    <SocialIcon className="size-8 md:size-4" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10 border-t border-catholic-purple-foreground/20 md:mb-0">
        <div className="container mx-auto py-6 md:px-4">
          <div className="mb-4 text-sm md:flex md:items-center md:justify-between">
            <div className="mb-4 text-center opacity-80 md:mb-0 md:text-left">
              <p>&copy; 2025 Archidiocèse de Los Santos. Tous droits réservés.</p>
            </div>
            <div className="flex flex-col items-end justify-center gap-4 text-center md:text-left">
              <Link
                to="/privacy"
                className="underline opacity-80 transition-colors hover:text-catholic-gold hover:opacity-100"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
          <div className="px-2 text-center text-sm opacity-60">
            <p>
              (( Le contenu de ce site est entièrement fictif, dans le cadre d'un jeu de rôle. Il
              n'est ni affilié ni un produit officiel de{' '}
              <a
                href="https://gta.world/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GTA World
              </a>
              . ))
            </p>
            <p className="mt-3 text-xs">
              (( Développé avec <span className="text-[#e25555]">❤</span> par{' '}
              <a
                className="text-inherit"
                href="https://forum-fr.gta.world/profile/11040-nairolf/"
                target="_blank"
              >
                Nairolf
              </a>
              ))
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
