export type EthnicGroup = {
  id: string
  label: string
}

export type EthnicGroupId = (typeof ETHNIC_GROUPS)[number]['id']

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
