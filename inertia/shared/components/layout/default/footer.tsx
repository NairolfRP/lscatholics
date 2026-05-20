import { MapPin, Phone } from 'lucide-react'
import { Link } from '@adonisjs/inertia/react'
import { FOOTER_MENU_ITEMS } from '@/shared/constants/menu.constants'
import { LinkText } from '@/shared/components/link-text'
import { urlFor } from '@/lib/client'
import { ARCHDIOCESE_SOCIAL_MEDIAS } from '@/shared/constants/social.constants'

export default function Footer() {
  return (
    <footer className="bg-catholic-purple text-white px-5 laptop:px-20 pb-safe">
      <div className="container mx-auto py-12">
        <div className="grid mobile:grid-cols-2 md:grid-cols-4 gap-8">
          {FOOTER_MENU_ITEMS.map((item) => (
            <div key={`footer-menu-link-${item.id}`}>
              <h4 className="font-semibold text-lg mb-4">{item.label}</h4>
              <ul className="space-y-3 text-sm">
                {item.children?.map((subItem) => (
                  <li key={`footer-menu-link-${item.id}-subitem-${subItem.id}`}>
                    <Link
                      route={subItem.route as never}
                      className="opacity-80 hover:opacity-100 hover:text-catholic-gold transition-colors"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-catholic-gold flex-shrink-0" />
                <div>
                  <p className="font-medium">Cathédrale Notre-Dame-des-Saints</p>
                  <p className="opacity-80">Ginger Street, Little Seoul</p>
                  <p className="opacity-80">Los Santos, SA 90010</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-catholic-gold flex-shrink-0" />
                <span className="opacity-80">700</span>
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-3 mt-7">
              {ARCHDIOCESE_SOCIAL_MEDIAS.map((social) => (
                <a
                  key={social.title}
                  href={social.url}
                  title={social.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-12 md:size-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-catholic-gold transition-colors"
                >
                  <social.icon className="size-8 md:size-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 mb-10 md:mb-0">
        <div className="container mx-auto md:px-4 py-6">
          <div className="md:flex md:items-center md:justify-between text-sm mb-4">
            <div className="text-center md:text-left opacity-80 mb-4 md:mb-0">
              <p>&copy; 2025 Archidiocèse de Los Santos. Tous droits réservés.</p>
            </div>
            <div className="flex gap-4 justify-center text-center md:text-left">
              <Link
                href={urlFor('privacy')}
                className="opacity-80 hover:opacity-100 hover:text-catholic-gold underline transition-colors"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
          <div className="text-center opacity-60 px-2 text-sm">
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
              (( Développé avec <span className="color-[#e25555]">❤</span> par{' '}
              <LinkText
                className="text-inherit"
                href="https://forum-fr.gta.world/profile/11040-nairolf/"
                target="_blank"
              >
                Nairolf
              </LinkText>{' '}
              ))
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
