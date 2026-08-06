export type DistrictOption = { value: string; label: string }
export type DistrictGroup = { label: string; options: DistrictOption[] }

const LS_DISTRICTS: DistrictOption[] = [
  { value: 'downtown_los_santos', label: 'Centre-ville de Los Santos' },
  { value: 'burton', label: 'Burton' },
  { value: 'textile_city', label: 'Textile City' },
  { value: 'mission_row', label: 'Mission Row' },
  { value: 'pillbox_hill', label: 'Pillbox Hill' },
  { value: 'legion_square', label: 'Legion Square' },
  { value: 'vinewood', label: 'Vinewood' },
  { value: 'downtown_vinewood', label: 'Centre de Vinewood' },
  { value: 'west_vinewood', label: 'Vinewood West' },
  { value: 'east_vinewood', label: 'Vinewood East' },
  { value: 'vinewood_hills', label: 'Collines de Vinewood' },
  { value: 'hawick', label: 'Hawick' },
  { value: 'alta', label: 'Alta' },
  { value: 'mirror_park', label: 'Mirror Park' },
  { value: 'rockford_hills', label: 'Rockford Hills' },
  { value: 'richman', label: 'Richman' },
  { value: 'morningwood', label: 'Morningwood' },
  { value: 'little_seoul', label: 'Little Seoul' },
  { value: 'vespucci', label: 'Vespucci' },
  { value: 'vespucci_beach', label: 'Plage de Vespucci' },
  { value: 'vespucci_canals', label: 'Canaux de Vespucci' },
  { value: 'puerto_del_sol', label: 'Puerto Del Sol' },
  { value: 'del_perro', label: 'Del Perro' },
  { value: 'pacific_bluffs', label: 'Pacific Bluffs' },
  { value: 'east_los_santos', label: 'East Los Santos' },
  { value: 'cypress_flats', label: 'Cypress Flats' },
  { value: 'la_mesa', label: 'La Mesa' },
  { value: 'el_burro_heights', label: 'El Burro Heights' },
  { value: 'murrieta_heights', label: 'Murrieta Heights' },
  { value: 'south_los_santos', label: 'South Los Santos' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'davis', label: 'Davis' },
  { value: 'rancho', label: 'Rancho' },
  { value: 'chamberlain_hills', label: 'Chamberlain Hills' },
  { value: 'la_puerta', label: 'La Puerta' },
  { value: 'banning', label: 'Banning' },
  { value: 'los_santos_airport', label: 'Aéroport international de LS' },
  { value: 'port_of_los_santos', label: 'Port de Los Santos' },
]

const BEYOND_LS_DISTRICTS: DistrictOption[] = [
  { value: 'baytree_canyon', label: 'Baytree Canyon' },
  { value: 'banham_canyon', label: 'Banham Canyon' },
  { value: 'cassidy_creek', label: 'Cassidy Creek' },
  { value: 'galilee', label: 'Galilee' },
  { value: 'great_chaparral', label: 'Great Chaparral' },
  { value: 'fort_zancudo', label: 'Fort Zancudo' },
  { value: 'grapeseed', label: 'Grapeseed' },
  { value: 'sandy_shores', label: 'Sandy Shores' },
  { value: 'palomino_highlands', label: 'Palomino Highlands' },
  { value: 'paleto_bay', label: 'Paleto Bay' },
  { value: 'harmony', label: 'Harmony' },
  { value: 'north_chumash', label: 'North Chumash' },
  { value: 'chumash', label: 'Chumash' },
  { value: 'stab_city', label: 'Stab City' },
  { value: 'alamo_sea', label: 'Alamo Sea' },
  { value: 'grand_senora_desert', label: 'Désert Grand Senora' },
  { value: 'mount_chiliad', label: 'Mont Chiliad' },
  { value: 'mount_gordo', label: 'Mont Gordo' },
  { value: 'mount_josiah', label: 'Mont Josiah' },
  { value: 'raton_canyon', label: 'Raton Canyon' },
  { value: 'san_chianski_mountains', label: 'Monts San Chianski' },
  { value: 'tongva_hills', label: 'Tongva Hills' },
]

export const DISTRICT_GROUPS: DistrictGroup[] = [
  { label: 'Los Santos', options: LS_DISTRICTS },
  { label: 'Hors de Los Santos', options: BEYOND_LS_DISTRICTS },
]

export const DISTRICT_VALUES = [
  ...LS_DISTRICTS.map((district) => district.value),
  ...BEYOND_LS_DISTRICTS.map((district) => district.value),
]

export function getDistrictLabel(value: string) {
  for (const group of DISTRICT_GROUPS) {
    const district = group.options.find((option) => option.value === value)
    if (district) {
      return district.label
    }
  }
  return ''
}
