import type { ReactNode } from 'react'
import { createEnum } from '#shared/lib/enum.ts'

export const [GENDER, GENDER_VALUES] = createEnum({
  MALE: 'male',
  FEMALE: 'female',
})

export const genderLabels = Object.freeze({
  [GENDER.MALE]: 'Homme',
  [GENDER.FEMALE]: 'Femme',
})

export const genderOptions = GENDER_VALUES.map((value) => ({
  value,
  label: genderLabels[value],
}))

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

export const [SPOKEN_LANGUAGE, SPOKEN_LANGUAGE_VALUES] = createEnum({
  SPANISH: 'spanish',
  FRENCH: 'french',
  PORTUGUESE: 'portuguese',
  ITALIAN: 'italian',
  LATIN: 'latin',
  VIETNAMESE: 'vietnamese',
  TAGALOG: 'tagalog',
  POLISH: 'polish',
  GERMAN: 'german',
  KOREAN: 'korean',
  CHINESE: 'chinese',
  OTHER: 'other',
})

export const spokenLanguageLabels = Object.freeze({
  [SPOKEN_LANGUAGE.SPANISH]: 'Espagnol',
  [SPOKEN_LANGUAGE.FRENCH]: 'Français',
  [SPOKEN_LANGUAGE.PORTUGUESE]: 'Portugais',
  [SPOKEN_LANGUAGE.ITALIAN]: 'Italien',
  [SPOKEN_LANGUAGE.LATIN]: 'Latin',
  [SPOKEN_LANGUAGE.VIETNAMESE]: 'Vietnamien',
  [SPOKEN_LANGUAGE.TAGALOG]: 'Tagalog (Filipino)',
  [SPOKEN_LANGUAGE.POLISH]: 'Polonais',
  [SPOKEN_LANGUAGE.GERMAN]: 'Allemand',
  [SPOKEN_LANGUAGE.KOREAN]: 'Coréen',
  [SPOKEN_LANGUAGE.CHINESE]: 'Chinois (mandarin)',
  [SPOKEN_LANGUAGE.OTHER]: 'Autre',
})

export const spokenLanguageOptions = SPOKEN_LANGUAGE_VALUES.map((value) => ({
  value,
  label: spokenLanguageLabels[value],
}))

export const [APPLICATION_SOURCE, APPLICATION_SOURCE_VALUES] = createEnum({
  EMPLOYEE_REFERRAL: 'employeeReferral',
  PRESS: 'press',
  WEBSITE: 'website',
  INTERNET: 'internet',
  SOCIAL_MEDIA: 'socialMedia',
  JOB_FAIR: 'jobFair',
  OTHER: 'other',
})

export const applicationSourceLabels = Object.freeze({
  [APPLICATION_SOURCE.EMPLOYEE_REFERRAL]: "Par un employé de l'Archidiocèse",
  [APPLICATION_SOURCE.PRESS]: 'Presse / Médias',
  [APPLICATION_SOURCE.WEBSITE]: "Site web de l'Archidiocèse",
  [APPLICATION_SOURCE.INTERNET]: 'Internet',
  [APPLICATION_SOURCE.SOCIAL_MEDIA]: 'Facebrowser',
  [APPLICATION_SOURCE.JOB_FAIR]: "Salon de l'emploi",
  [APPLICATION_SOURCE.OTHER]: 'Autre',
})

export const applicationSourceOptions = APPLICATION_SOURCE_VALUES.map((value) => ({
  value,
  label: applicationSourceLabels[value],
}))

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
  DISCORD_USERNAME: 32,
  MOTIVATIONS: 1500,
  MAX_PROFESSIONAL_EXPERIENCE: 3,
} as const)
