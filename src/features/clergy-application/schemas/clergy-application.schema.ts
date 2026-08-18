import { z } from 'zod'
import type { ClergyRole } from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  CLERGY_APPLICATION_MAX_LENGTHS,
  CLERGY_APPLICATION_MIN_LENGTHS,
  CLERGY_MARITAL_STATUS,
  CLERGY_MARITAL_STATUS_VALUES,
  CLERGY_ROLE,
  CLERGY_ROLE_VALUES,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import { ageSchema, nameSchema } from '#shared/schemas/person.schema.ts'
import { discordUsernameSchema } from '#shared/schemas/social.schema.ts'
import { emptyToNull, looseObjectSchema } from '#shared/schemas/utils.schema.ts'

const MAX = CLERGY_APPLICATION_MAX_LENGTHS
const MIN = CLERGY_APPLICATION_MIN_LENGTHS

export const submitClergyApplicationFnSchema = z.object({
  role: z.enum(CLERGY_ROLE_VALUES),
  values: looseObjectSchema,
})

export const clergyApplicationPageSearchSchema = z.object({
  role: emptyToNull(z.enum(CLERGY_ROLE_VALUES))
    .default(null)
    .catch(() => null),
})

const requiredLongTextSchema = (
  min: number,
  max: number,
  requiredMessage: string,
  minErrorMessage: string
) =>
  z
    .string({ error: requiredMessage })
    .trim()
    .min(min, { error: minErrorMessage })
    .max(max, {
      error: (iss) => `Votre réponse ne doit pas dépasser ${iss.maximum} caractères.`,
    })

export const clergyApplicationBaseSchema = z.object({
  discordUsername: discordUsernameSchema,
  sanctions: z
    .url({
      protocol: /^https?$/,
      hostname: /^ucp-fr\.gta\.world$/,
      error: (iss) =>
        iss.input === undefined
          ? 'Le lien vers votre dossier serveur est requis.'
          : 'Lien de partage de dossier serveur invalide',
    })
    .regex(/\/view\/record\/[a-zA-Z0-9]+$/, {
      error: 'Lien de partage de dossier serveur invalide',
    })
    .max(MAX.SANCTIONS, {
      error: (iss) => `L'URL ne doit pas dépasser ${iss.maximum} caractères.`,
    }),
  firstname: nameSchema('prénom'),
  lastname: nameSchema('nom de famille'),
  characterStory: requiredLongTextSchema(
    MIN.CHARACTER_STORY,
    MAX.CHARACTER_STORY,
    'L’histoire de votre personnage est requise.',
    `L’histoire de votre personnage doit comporter au moins ${MIN.CHARACTER_STORY} caractères.`
  ),
  motivations: requiredLongTextSchema(
    MIN.MOTIVATIONS,
    MAX.MOTIVATIONS,
    'Vos motivations sont requises.',
    `Vos motivations doivent comporter au moins ${MIN.MOTIVATIONS} caractères.`
  ),
  noTrollingDeclaration: z.literal(true, {
    error:
      'Vous devez accepter l’engagement de ne pas troller et de ne pas pratiquer le RP religieux à des fins abusives ou exagérées.',
  }),
  legalOnlyDeclaration: z.literal(true, {
    error: 'Vous devez déclarer que votre personnage est uniquement légal.',
  }),
})

export const priestApplicationSchema = clergyApplicationBaseSchema.extend({
  age: ageSchema({
    requiredMessage: 'Veuillez saisir l’âge de votre personnage.',
    min: MAX.MIN_PRIEST_AGE,
    max: MAX.MAX_PRIEST_AGE,
    minErrorMessage: `L’âge minimum pour les personnages prêtres est de ${MAX.MIN_PRIEST_AGE} ans.`,
    maxErrorMessage: `L’âge d’un personnage prêtre ne peut pas dépasser ${MAX.MAX_PRIEST_AGE} ans.`,
  }),
})

export const temporaryDeaconApplicationSchema = clergyApplicationBaseSchema.extend({
  age: ageSchema({
    requiredMessage: 'Veuillez saisir l’âge de votre personnage.',
    min: MAX.MIN_TEMPORARY_DEACON_AGE,
    max: MAX.MAX_TEMPORARY_DEACON_AGE,
    minErrorMessage: `L’âge minimum pour les personnages diacre temporaire est de ${MAX.MIN_TEMPORARY_DEACON_AGE} ans.`,
    maxErrorMessage: `L’âge du personnage ne peut pas dépasser ${MAX.MAX_TEMPORARY_DEACON_AGE} ans.`,
  }),
})

export const permanentDeaconApplicationSchema = clergyApplicationBaseSchema.extend({
  age: ageSchema({
    requiredMessage: 'Veuillez saisir l’âge de votre personnage.',
    min: MAX.MIN_UNMARRIED_PERMANENT_DEACON_AGE,
    max: 120,
    minErrorMessage: `L’âge minimum pour les personnages diacre permanent est de ${MAX.MIN_UNMARRIED_PERMANENT_DEACON_AGE} ans.`,
    maxErrorMessage: `L’âge du personnage ne peut pas dépasser 120 ans.`,
  }),
  maritalStatus: z.enum(CLERGY_MARITAL_STATUS_VALUES, {
    error: (iss) =>
      iss.input === undefined
        ? 'Vous devez indiquer la situation matrimoniale de votre personnage.'
        : 'Situation matrimoniale invalide.',
  }),
})

export const clergyApplicationSchema = (role: ClergyRole) =>
  clergyApplicationBaseSchema
    .extend({
      age: ageSchema({
        requiredMessage: 'Veuillez saisir l’âge de votre personnage.',
        min: 0,
      }),
      maritalStatus: z.enum(CLERGY_MARITAL_STATUS_VALUES).optional(),
    })
    .superRefine((values, ctx) => {
      const { maritalStatus, age } = values

      switch (role) {
        case CLERGY_ROLE.PRIEST: {
          if (age < MAX.MIN_PRIEST_AGE) {
            ctx.addIssue({
              code: 'custom',
              path: ['age'],
              message: `L’âge minimum pour être ordonné prêtre est de ${MAX.MIN_PRIEST_AGE} ans.`,
              input: age,
            })
          }
          if (age > MAX.MAX_PRIEST_AGE) {
            ctx.addIssue({
              code: 'custom',
              path: ['age'],
              message: `L’âge d’un prêtre ne peut pas dépasser ${MAX.MAX_PRIEST_AGE} ans.`,
              input: age,
            })
          }
          break
        }
        case CLERGY_ROLE.DEACON_TEMPORARY: {
          if (age < MAX.MIN_TEMPORARY_DEACON_AGE) {
            ctx.addIssue({
              code: 'custom',
              path: ['age'],
              message: `L’âge minimum pour devenir diacre temporaire est de ${MAX.MIN_TEMPORARY_DEACON_AGE} ans.`,
              input: age,
            })
          }
          if (age > MAX.MAX_TEMPORARY_DEACON_AGE) {
            ctx.addIssue({
              code: 'custom',
              path: ['age'],
              message: `L’âge d’un diacre temporaire ne peut pas dépasser ${MAX.MAX_TEMPORARY_DEACON_AGE} ans.`,
              input: age,
            })
          }
          break
        }
        case CLERGY_ROLE.DEACON_PERMANENT: {
          if (!maritalStatus) {
            ctx.addIssue({
              code: 'custom',
              path: ['maritalStatus'],
              message: 'Veuillez indiquer votre situation matrimoniale.',
              input: maritalStatus,
            })
          }

          const minAge =
            maritalStatus === CLERGY_MARITAL_STATUS.SINGLE
              ? MAX.MIN_UNMARRIED_PERMANENT_DEACON_AGE
              : MAX.MIN_MARRIED_PERMANENT_DEACON_AGE

          if (age < minAge) {
            ctx.addIssue({
              code: 'custom',
              path: ['age'],
              message:
                maritalStatus === CLERGY_MARITAL_STATUS.SINGLE
                  ? `L’âge minimum pour devenir diacre permanent célibataire est de ${MAX.MIN_UNMARRIED_PERMANENT_DEACON_AGE} ans.`
                  : `L’âge minimum pour devenir diacre permanent marié est de ${MAX.MIN_MARRIED_PERMANENT_DEACON_AGE} ans.`,
              input: age,
            })
          }
          break
        }
      }
    })

export type PriestApplicationInput = z.input<typeof priestApplicationSchema>
export type TemporaryDeaconApplicationInput = z.input<typeof temporaryDeaconApplicationSchema>
export type PermanentDeaconApplicationInput = z.input<typeof permanentDeaconApplicationSchema>

export type ClergyApplicationInput = z.input<typeof clergyApplicationSchema>
export type ClergyApplicationOutput = z.output<ReturnType<typeof clergyApplicationSchema>>
