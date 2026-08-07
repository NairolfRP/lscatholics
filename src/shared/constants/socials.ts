import type { Social } from '../types/social.types'
import DiscordIcon from '../components/icons/discord'
import FacebrowserIcon from '../components/icons/facebrowser'
import GithubIcon from '../components/icons/github'
import YoutubeIcon from '../components/icons/youtube'

export const socials: Record<string, Social> = {
  facebrowser: {
    label: 'Suivre LSCatholics sur Facebrowser',
    href: 'https://face-fr.gta.world/page/lscatholics',
    className: 'bg-[#F5A800] hover:bg-yellow-600 text-white',
    icon: FacebrowserIcon,
  },
  youtube: {
    label: "Chaîne youtube de l'Archidiocèse de Los Santos",
    href: 'https://www.youtube.com/@lscatholics',
    className: 'bg-red-600 hover:bg-red-700 text-white',
    icon: YoutubeIcon,
  },
  discord: {
    label: '(( Serveur discord de LS Catholics ))',
    href: 'https://discord.gg/CXVKwfP6cs',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
    icon: DiscordIcon,
    metadata: {
      isOOC: true,
    },
  },
  github: {
    label: "(( Code source de l'application web LSCatholics ))",
    href: 'https://github.com/NairolfRP/lscatholics',
    className: 'bg-[#181717] hover:bg-[#4752c4] text-white',
    icon: GithubIcon,
    metadata: {
      isOOC: true,
      only: ['footer'],
    },
  },
} satisfies Record<string, Social>
