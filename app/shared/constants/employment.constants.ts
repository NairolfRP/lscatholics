export const EMPLOYMENT_TYPE = {
  full_time: 'Temps plein',
  part_time: 'Temps partiel',
  contract: 'Contrat',
  internship: 'Stage',
  temporary: 'Temporaire',
  occasional: 'Occasionnel',
} as const

export const getEmploymentTypes = Object.keys(EMPLOYMENT_TYPE)

export type EmploymentType = keyof typeof EMPLOYMENT_TYPE

export const APPLICATION_SOURCES = [
  { id: 'employeeReferral', label: "Par un employé de l'Archidiocèse" },
  { id: 'press', label: 'Presse / Médias' },
  { id: 'website', label: "Site web de l'Archidiocèse" },
  { id: 'internet', label: 'Internet' },
  { id: 'socialMedia', label: 'Facebrowser' },
  { id: 'jobFair', label: "Salon de l'emploi" },
  { id: 'other', label: 'Autre' },
] as const satisfies Array<{ id: string; label: string }>

export const getApplicationSourcesIds = () => APPLICATION_SOURCES.map((s) => s.id)

export const getApplicationSourceLabel = (id: ApplicationSource) =>
  APPLICATION_SOURCES.find((s) => s.id === id)?.label

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number]['id']

export const APPLICANT_STATEMENTS = [
  {
    id: 'statement_one',
    label:
      "Je comprends que l'Archidiocèse de Los Santos est une institution religieuse catholique romaine et que tous les membres de son personnel sont tenus de respecter et de se conformer aux valeurs, aux enseignements et à la morale de l'Église.",
  },
  {
    id: 'statement_two',
    label:
      "Je certifie sur l'honneur que les informations fournies au travers de ce formulaire et au cours de la procédure d'emploi sont vraies et complètes. Je comprends qu'une fausse déclaration suffirait à me disqualifier, ou, si embauché, à me licencier.",
  },
  {
    id: 'statement_three',
    label:
      "Je consents et autorise l'Archidiocèse à contacter mes références et mes employeurs (anciens et actuels).",
  },
  {
    id: 'statement_four',
    label:
      "Je comprends que mon embauche et mon maintien dans l'emploi est conditionné au fait que je dois prouver que je suis légalement autorisé à travailler aux États-Unis, conformément à la loi sur l'immigration de 1986.",
  },
  {
    id: 'statement_five',
    label:
      "Je comprends que mon emploi est pour une durée indéterminée, que cette demande d'emploi n'est pas un contrat de travail, et que l'Archidiocèse ou moi-même pouvons, à tout moment, avec ou sans motif ou préavis, mettre fin à mon emploi.",
  },
  {
    id: 'statement_six',
    label:
      "Je comprends que la décision sur mon emploi peut dépendre de la vérification de mes références, de mes empreintes digitales et/ou de tests physiques et préalables à l'embauche, y compris des dépistages de drogues. Par ailleurs, je consents et j'autorise l'Archidiocèse à demander l'accès à mes antécedents judiciaires.",
  },
] as const satisfies Array<{ id: string; label: string }>

export const getApplicantStatementsIds = () => APPLICANT_STATEMENTS.map((s) => s.id)
