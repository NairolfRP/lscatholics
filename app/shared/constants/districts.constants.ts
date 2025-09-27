export type GTA5District = {
  id: string
  label: string
  beyondLS?: boolean
}

export type GTA5DistrictId = (typeof GTA5_DISTRICTS)[number]['id']

export const GTA5_DISTRICTS = [
  { id: 'downtown_los_santos', label: 'Centre-ville de LS' },
  { id: 'burton', label: 'Burton' },
  { id: 'textile_city', label: 'Textile City' },
  { id: 'mission_row', label: 'Mission Row' },
  { id: 'pillbox_hill', label: 'Pillbox Hill' },
  { id: 'legion_square', label: 'Legion Square' },

  { id: 'vinewood', label: 'Vinewood' },
  { id: 'downtown_vinewood', label: 'Centre de Vinewood' },
  { id: 'west_vinewood', label: 'Vinewood West' },
  { id: 'east_vinewood', label: 'Vinewood East' },
  { id: 'vinewood_hills', label: 'Collines de Vinewood' },
  { id: 'hawick', label: 'Hawick' },
  { id: 'alta', label: 'Alta' },
  { id: 'mirror_park', label: 'Mirror Park' },

  { id: 'rockford_hills', label: 'Rockford Hills' },
  { id: 'richman', label: 'Richman' },
  { id: 'morningwood', label: 'Morningwood' },

  { id: 'little_seoul', label: 'Little Seoul' },
  { id: 'vespucci', label: 'Vespucci' },
  { id: 'vespucci_beach', label: 'Plage de Vespucci' },
  { id: 'vespucci_canals', label: 'Canaux de Vespucci' },
  { id: 'puerto_del_sol', label: 'Puerto Del Sol' },

  { id: 'del_perro', label: 'Del Perro' },
  { id: 'pacific_bluffs', label: 'Pacific Bluffs' },

  { id: 'east_los_santos', label: 'East Los Santos' },
  { id: 'cypress_flats', label: 'Cypress Flats' },
  { id: 'la_mesa', label: 'La Mesa' },
  { id: 'el_burro_heights', label: 'El Burro Heights' },
  { id: 'murrieta_heights', label: 'Murrieta Heights' },

  { id: 'south_los_santos', label: 'South Los Santos' },
  { id: 'strawberry', label: 'Strawberry' },
  { id: 'davis', label: 'Davis' },
  { id: 'rancho', label: 'Rancho' },
  { id: 'chamberlain_hills', label: 'Chamberlain Hills' },
  { id: 'la_puerta', label: 'La Puerta' },
  { id: 'banning', label: 'Banning' },
  { id: 'los_santos_airport', label: 'Aéroport International de LS' },
  { id: 'port_of_los_santos', label: 'Port de Los Santos' },

  { id: 'baytree_canyon', label: 'Baytree Canyon', beyondLS: true },
  { id: 'banham_canyon', label: 'Banham Canyon', beyondLS: true },
  { id: 'cassidy_creek', label: 'Cassidy Creek', beyondLS: true },
  { id: 'galilee', label: 'Galilee', beyondLS: true },
  { id: 'great_chaparral', label: 'Great Chaparral', beyondLS: true },
  { id: 'fort_zancudo', label: 'Fort Zancudo', beyondLS: true },
  { id: 'grapeseed', label: 'Grapeseed', beyondLS: true },
  { id: 'sandy_shores', label: 'Sandy Shores', beyondLS: true },
  { id: 'palomino_highlands', label: 'Palomino Highlands', beyondLS: true },
  { id: 'paleto_bay', label: 'Paleto Bay', beyondLS: true },
  { id: 'harmony', label: 'Harmony', beyondLS: true },
  { id: 'north_chumash', label: 'North Chumash', beyondLS: true },
  { id: 'chumash', label: 'Chumash', beyondLS: true },
  { id: 'stab_city', label: 'Stab City', beyondLS: true },

  { id: 'alamo_sea', label: 'Alamo Sea', beyondLS: true },
  { id: 'grand_senora_desert', label: 'Désert Grand Senora', beyondLS: true },
  { id: 'mount_chiliad', label: 'Mont Chiliad', beyondLS: true },
  { id: 'mount_gordo', label: 'Mont Gordo', beyondLS: true },
  { id: 'mount_josiah', label: 'Mont Josiah', beyondLS: true },
  { id: 'raton_canyon', label: 'Raton Canyon', beyondLS: true },
  { id: 'san_chianski_mountains', label: 'Monts San Chianski', beyondLS: true },
  { id: 'tongva_hills', label: 'Tongva Hills', beyondLS: true },
] as const satisfies GTA5District[]

export const getDistrictIds = () => {
  return GTA5_DISTRICTS.map((d) => d.id)
}

export const getLSDistricts = () => {
  return GTA5_DISTRICTS.filter((d: GTA5District) => !d.beyondLS)
}

export const getNorthDistricts = () => {
  return GTA5_DISTRICTS.filter((d: GTA5District) => d.beyondLS)
}

export const getDistrictLabelById = (id: string) =>
  GTA5_DISTRICTS.find((d) => d.id === id)?.label || ''
