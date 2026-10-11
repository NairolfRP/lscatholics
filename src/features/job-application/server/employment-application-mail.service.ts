import type { EmploymentApplicationOutput } from '#/features/job-application/schemas/employment-application.schema.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'
import type { MailLetterBlock } from '#server/services/mail-template.service.ts'
import { renderMailTemplate } from '#server/services/mail-template.service.ts'

export const EMPLOYMENT_APPLICATION_MAIL_SUBJECT = "Votre demande d'emploi - LS Catholics"

const COAT_OF_ARMS_URL = 'https://i.imgur.com/6YJtfqY.png'

export async function sendEmploymentApplicationAcknowledgementMail(
  data: EmploymentApplicationOutput
): Promise<void> {
  const to = data.eyefindMail
  if (!to) return

  const block: MailLetterBlock = {
    title: 'Archidiocèse de Los Santos',
    greeting: 'Madame, Monsieur,',
    intro:
      "Nous vous remercions de l'intérêt que vous portez à l'Archidiocèse de Los Santos. Nous accusons réception des informations que vous nous avez transmises concernant votre parcours.",
    paragraphs: [
      "Si votre profil correspond à nos besoins actuels, nous vous contacterons dans les 7 prochains jours. À défaut, votre candidature et/ou curriculum vitae seront conservés dans nos dossiers pendant une période d'un mois en vue d'éventuelles opportunités futures.",
      "Nous vous souhaitons toute la réussite dans votre recherche d'emploi.",
    ],
    close: 'Sincèrement,',
    signature: 'Département des Ressources Humaines<br>Archidiocèse de Los Santos',
  }

  const payload: SendEyefindMailInput = {
    to,
    subject: EMPLOYMENT_APPLICATION_MAIL_SUBJECT,
    body: [
      'Madame, Monsieur,',
      '',
      "Nous vous remercions de l'intérêt que vous portez à l'Archidiocèse de Los Santos. Nous accusons réception des informations que vous nous avez transmises concernant votre parcours.",
      '',
      "Si votre profil correspond à nos besoins actuels, nous vous contacterons dans les 7 prochains jours. À défaut, votre candidature et/ou curriculum vitae seront conservés dans nos dossiers pendant une période d'un mois en vue d'éventuelles opportunités futures.",
      '',
      "Nous vous souhaitons toute la réussite dans votre recherche d'emploi.",
      '',
      'Sincèrement,',
      'Département des Ressources Humaines',
      'Archidiocèse de Los Santos',
    ].join('\n'),
    html: renderMailTemplate({ logoUrl: COAT_OF_ARMS_URL, blocks: [block] }),
  }

  try {
    const result = await sendEyefindMail(payload)
    logger.info({ messageId: result.messageId }, 'Employment application acknowledgement mail sent')
  } catch (err) {
    logger.error(
      { errorCode: err instanceof EyefindMailError ? err.code : undefined, err },
      'Failed to send employment application acknowledgement mail'
    )
  }
}
