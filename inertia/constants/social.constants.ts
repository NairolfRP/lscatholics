import Facebrowser from '@/components/svg/Facebrower.vue'
import Youtube from '@/components/svg/Youtube.vue'
import type { Component } from 'vue'
import Discord from '@/components/svg/Discord.vue'
import Github from '@/components/svg/Github.vue'

export type SocialMedia = {
  id: string
  title: string
  colorClasses: string
  url: string
  icon: Component
  isOOC?: boolean
  footerOnly?: boolean
}

export const SOCIAL_MEDIAS_COLORS_CLASSES = {
  facebrowser: 'bg-red-400 hover:bg-red-500',
  youtube: 'bg-red-600 hover:bg-red-700',
  discord: 'bg-blue-600 hover:bg-blue-700',
  github: 'bg-[#181717] hover:bg-[#4752c4]',
}

export const ARCHDIOCESE_SOCIAL_MEDIAS: SocialMedia[] = [
  {
    id: 'facebrowser',
    title: 'Suivre LSCatholics sur Facebrowser',
    colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.facebrowser,
    url: 'https://facebrowser.gta.world/pages/LSCatholics',
    icon: Facebrowser,
  },
  {
    id: 'youtube',
    title: "Chaîne youtube de l\'Archidiocèse de Los Santos",
    colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.youtube,
    url: 'https://www.youtube.com/@lscatholics',
    icon: Youtube,
  },
  {
    id: 'discord',
    title: '(( Serveur discord de LS Catholcis ))',
    colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.discord,
    url: 'https://discord.gg/CXVKwfP6cs',
    icon: Discord,
  },
  {
    id: 'github',
    title: "(( Code source de l'applciation web LSCatholics ))",
    colorClasses: SOCIAL_MEDIAS_COLORS_CLASSES.github,
    url: 'https://github.com/NairolfRP/lscatholics',
    icon: Github,
    isOOC: true,
    footerOnly: true,
  },
]
