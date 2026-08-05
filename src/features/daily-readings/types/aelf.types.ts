export type AELFReadingType = 'lecture_1' | 'psaume' | 'cantique' | 'lecture_2' | 'evangile'

export interface AELFReadingsMetadata {
  date: string
  zone: string
  couleur: string
  annee: string | null
  temps_liturgique: string | null
  semaine: string | null
  jour: string | null
  jour_liturgique_nom: string
  fete: string
  degre: string
  ligne1: string
  ligne2: string
  ligne3: string
  couleur2: string
  couleur3: string
}

export interface AELFReading {
  type: string
  refrain_psalmique: string | null
  ref_refrain: string | null
  titre: string | null
  contenu: string
  ref: string
  intro_lue: string | null
  verset_evangile: string | null
  ref_verset: string | null
}

export interface AELFMass {
  nom: string
  lectures: AELFReading[]
}

export interface AELFReadingsResponse {
  informations: AELFReadingsMetadata
  messes: AELFMass[]
}
