export interface AELFReadingsMetadata {
  date: string
  zone: string
  couleur: string
  annee: string
  temps_liturgique: string
  semaine: string
  jour: string
  jour_liturgique_nom: string
  fete: string
  degre: string
  ligne1: string
  ligne2: string
  ligne3: string
  couleur2: string | null
  couleur3: string | null
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
