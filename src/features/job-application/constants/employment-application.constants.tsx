import type { ReactNode } from 'react'
import { createEnum } from '#shared/lib/enum.ts'

export { GENDER, GENDER_VALUES, genderLabels, genderOptions } from '#shared/constants/gender.ts'
export {
  APPLICATION_SOURCE,
  APPLICATION_SOURCE_VALUES,
  applicationSourceLabels,
  applicationSourceOptions,
} from '#shared/constants/application-source.ts'
export {
  SPOKEN_LANGUAGE,
  SPOKEN_LANGUAGE_VALUES,
  spokenLanguageLabels,
  spokenLanguageOptions,
} from '#shared/constants/languages.ts'

export const [SCHOOL_LEVEL, SCHOOL_LEVEL_VALUES] = createEnum({
  NONE: 'none',
  HIGH_SCHOOL_DIPLOMA: 'highSchoolDiploma',
  SOME_COLLEGE: 'someCollege',
  ASSOCIATE_DEGREE: 'associateDegree',
  BACHELORS_DEGREE: 'bachelorsDegree',
  MASTERS_DEGREE: 'mastersDegree',
  DOCTORAL_DEGREE: 'doctoralDegree',
})

export const schoolLevelLabels = Object.freeze({
  [SCHOOL_LEVEL.NONE]: 'Aucun',
  [SCHOOL_LEVEL.HIGH_SCHOOL_DIPLOMA]: "Diplôme d'études secondaires (High School Diploma)",
  [SCHOOL_LEVEL.SOME_COLLEGE]: 'Études universitaires sans diplôme',
  [SCHOOL_LEVEL.ASSOCIATE_DEGREE]: "Grade d'Associé (Associate Degree)",
  [SCHOOL_LEVEL.BACHELORS_DEGREE]: 'Premier cycle universitaire (Licence / Bachelor’s Degree)',
  [SCHOOL_LEVEL.MASTERS_DEGREE]: 'Deuxième cycle universitaire (Master’s Degree)',
  [SCHOOL_LEVEL.DOCTORAL_DEGREE]: 'Doctorat',
})

export const schoolLevelOptions = SCHOOL_LEVEL_VALUES.map((value) => ({
  value,
  label: schoolLevelLabels[value],
}))

export const SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY: readonly string[] = [
  SCHOOL_LEVEL.NONE,
  SCHOOL_LEVEL.HIGH_SCHOOL_DIPLOMA,
]

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
      "Je consens et autorise l'Archidiocèse à contacter mes références et mes employeurs (anciens et actuels).",
  },
  {
    id: 'statement_four',
    label:
      "Je comprends que mon embauche et mon maintien dans l'emploi sont conditionnés au fait que je dois prouver que je suis légalement autorisé à travailler aux États-Unis, conformément à la loi sur l'immigration de 1986.",
  },
  {
    id: 'statement_five',
    label: (
      <>
        Je comprends que mon emploi est pour une durée indéterminée, que cette demande d'emploi
        n'est pas un contrat de travail, et que l'Archidiocèse ou moi-même pouvons, à tout moment,
        avec ou sans motif ou préavis, mettre fin à mon emploi. <em>(employment at-will)</em>
      </>
    ),
  },
  {
    id: 'statement_six',
    label:
      "Je comprends que la décision sur mon emploi peut dépendre de la vérification de mes références, de mes empreintes digitales et/ou de tests physiques préalables à l'embauche, y compris des dépistages de drogues. Par ailleurs, je consens et j'autorise l'Archidiocèse à demander l'accès à mes antécédents judiciaires.",
  },
] as const satisfies readonly { id: string; label: ReactNode }[]

export const EMPLOYMENT_APPLICATION_MAX_LENGTHS = Object.freeze({
  NAME: 50,
  ADDRESS: 60,
  PHONE: 8,
  EMPLOYEE_REFERRAL: 100,
  FIELD_OF_STUDY: 100,
  COMPANY_NAME: 100,
  POSITION: 100,
  REASON_FOR_LEAVING: 255,
  MOTIVATIONS: 1500,
  MAX_PROFESSIONAL_EXPERIENCE: 3,
} as const)
