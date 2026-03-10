import type { ComponentType } from 'react'
import FacebrowserIcon from '@/shared/components/svg/facebrowser'
import YoutubeIcon from '@/shared/components/svg/youtube'
import DiscordIcon from '@/shared/components/svg/discord'
import GithubIcon from '@/shared/components/svg/github'
import type { IconProps } from '@/shared/hooks/use_icon_props'

export type SocialMedia = {
  id: string
  title: string
  colorClasses: string
  url: string
  icon: ComponentType<IconProps>
  isOOC?: boolean
  footerOnly?: boolean
}

export const SOCIAL_MEDIAS_COLORS_CLASSES = {
  facebrowser: 'bg-red-400 hover:bg-red-500',
  youtube: 'bg-red-600 hover:bg-red-700',
  discord: 'bg-blue-600 hover:bg-blue-700',
  github: 'bg-[#181717] hover:bg-[#4752c4]',
}

export const SOCIAL_FACEBROWSER: SocialMedia = {
  id: 'facebrowser',
  title: 'Suivre LSCatholics sur Facebrowser',
  colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.facebrowser,
  url: 'https://facebrowser.gta.world/pages/LSCatholics',
  icon: FacebrowserIcon,
}

export const SOCIAL_YOUTUBE: SocialMedia = {
  id: 'youtube',
  title: "Chaîne youtube de l\'Archidiocèse de Los Santos",
  colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.youtube,
  url: 'https://www.youtube.com/@lscatholics',
  icon: YoutubeIcon,
}

export const SOCIAL_DISCORD: SocialMedia = {
  id: 'discord',
  title: '(( Serveur discord de LS Catholcis ))',
  colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.discord,
  url: 'https://discord.gg/CXVKwfP6cs',
  icon: DiscordIcon,
}

export const SOCIAL_GITHUB: SocialMedia = {
  id: 'github',
  title: "(( Code source de l'applciation web LSCatholics ))",
  colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.github,
  url: 'https://github.com/NairolfRP/lscatholics',
  icon: GithubIcon,
  isOOC: true,
  footerOnly: true,
}

export const ARCHDIOCESE_SOCIAL_MEDIAS: SocialMedia[] = [
  SOCIAL_FACEBROWSER,
  SOCIAL_YOUTUBE,
  SOCIAL_DISCORD,
  SOCIAL_GITHUB,
]
