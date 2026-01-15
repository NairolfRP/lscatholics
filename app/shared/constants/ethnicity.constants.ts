export type EthnicGroup = {
  id: string
  label: string
}

export type EthnicGroupId = (typeof ETHNIC_GROUPS)[number]['id']

export const DISCORD_PARISHIONNER_ETHNIC_TAG = {
  LATINO: '1254695730044604478',
  BLACK: '1254695883665051720',
  IRISH: '1254696047695892500',
  ITALIAN: '1254696098262552606',
  FRENCH: '1254696138586718289',
}

export const ETHNIC_GROUPS = [
  {
    id: 'white',
    label: 'Blanc',
  },
  {
    id: 'hispanic',
    label: 'Hispanique / Latino',
  },
  {
    id: 'black',
    label: 'Noir / Afro-Américain',
  },
  {
    id: 'nativeAmerican',
    label: "Amérindien / Autochtone d''Alaska",
  },
  {
    id: 'asian',
    label: 'Asiatique',
  },
  {
    id: 'pacificIslander',
    label: 'Hawaïen / Océanien',
  },
  {
    id: 'other',
    label: 'Autre ethnie',
  },
] as const satisfies EthnicGroup[]

export const getEthnicsGroupsIds = () => {
  return ETHNIC_GROUPS.map((e) => e.id)
}

export const getEthnicLabelById = (id: string) =>
  ETHNIC_GROUPS.find((e) => e.id === id)?.label || ''

export const LOCAL_ETHNICS_COMMUNITIES = [
  {
    id: 'none',
    label: 'N/A',
  },
  {
    id: 'latino',
    label: 'Latino/Hispanique',
    discordTag: DISCORD_PARISHIONNER_ETHNIC_TAG.LATINO,
  },
  {
    id: 'black',
    label: 'Noir/Afro-américain',
    discordTag: DISCORD_PARISHIONNER_ETHNIC_TAG.BLACK,
  },
  {
    id: 'irish',
    label: 'Irlandais',
    discordTag: DISCORD_PARISHIONNER_ETHNIC_TAG.IRISH,
  },
  {
    id: 'italian',
    label: 'Italien',
    discordTag: DISCORD_PARISHIONNER_ETHNIC_TAG.ITALIAN,
  },
  {
    id: 'french',
    label: 'Français',
    discordTag: DISCORD_PARISHIONNER_ETHNIC_TAG.FRENCH,
  },
]

export const getLocalEthnicsCommunitiesIds = () => {
  return LOCAL_ETHNICS_COMMUNITIES.map((e) => e.id)
}

export const getLocalEthnicCommunityLabelById = (id: string) =>
  LOCAL_ETHNICS_COMMUNITIES.find((e) => e.id === id)?.label || ''

export const getLocalEthnicCommunityDiscordTag = (id: string) =>
  LOCAL_ETHNICS_COMMUNITIES.find((e) => e.id === id)?.discordTag
