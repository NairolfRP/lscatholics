import { APP_PRODUCTION_URL } from '#/config/app.constants.ts'
import { contactSubjectLabels } from '#/features/contact/constants/contact-subjects.ts'
import type { ContactFormOutput } from '#/features/contact/schemas/contact.schema.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'
import type { MailLetterBlock } from '#server/services/mail-template.service.ts'
import { escapeHtml, renderMailTemplate } from '#server/services/mail-template.service.ts'
import { socials } from '#shared/constants/socials.ts'

export const CONTACT_ACKNOWLEDGEMENT_MAIL_SUBJECT = 'Votre demande de contact - LS Catholics'

const COAT_OF_ARMS_URL = 'https://i.imgur.com/6YJtfqY.png'
const FACE_BROWSER_URL = socials.facebrowser.href

export async function sendContactAcknowledgementMail(data: ContactFormOutput): Promise<void> {
  const to = data.eyefindMail
  if (!to) return

  const fullName = `${data.firstName} ${data.lastName}`.trim()
  const escapedName = escapeHtml(fullName)
  const subjectLabel = contactSubjectLabels[data.subject]

  const enBlock: MailLetterBlock = {
    title: 'Archidiocèse de Los Santos',
    greeting: `Bonjour <strong>${escapedName}</strong>,`,
    intro: `Votre demande de contact avec pour sujet « ${subjectLabel} » a bien été reçue et, si nécessaire, sera redirigée vers le département ou l'entité concernée.`,
    paragraphs: [
      'Un membre du personnel vous recontactera par téléphone ou par e-mail dans les plus brefs délais.',
      "Nous vous remercions pour l'intérêt que vous nous portez.",
    ],
    close: 'Fraternellement,',
    signature: 'Archidiocèse de Los Santos',
    links: [
      { label: 'Retrouvez-nous sur :', href: APP_PRODUCTION_URL },
      { label: 'Suivez-nous sur Facebrowser :', href: FACE_BROWSER_URL },
      { label: 'Encuéntranos en:', href: APP_PRODUCTION_URL },
      { label: 'Síguenos en Facebrowser:', href: FACE_BROWSER_URL },
    ],
  }

  const payload: SendEyefindMailInput = {
    to,
    subject: CONTACT_ACKNOWLEDGEMENT_MAIL_SUBJECT,
    body: [
      `Bonjour ${fullName},`,
      '',
      `Votre demande de contact avec pour sujet « ${subjectLabel} » a bien été reçue et, si nécessaire, sera redirigée vers le département ou l'entité concernée.`,
      '',
      'Un membre du personnel vous recontactera par téléphone ou par e-mail dans les plus brefs délais.',
      '',
      "Nous vous remercions pour l'intérêt que vous nous portez.",
      '',
      'Fraternellement,',
      'Archidiocèse de Los Santos',
      '',
      '----------------',
      '',
      `Retrouvez-nous sur : ${APP_PRODUCTION_URL}`,
      `Suivez-nous sur Facebrowser : ${FACE_BROWSER_URL}`,
      '',
      '',
      `Encuéntranos en: ${APP_PRODUCTION_URL}`,
      `Síguenos en Facebrowser: ${FACE_BROWSER_URL}`,
    ].join('\n'),
    html: renderMailTemplate({ logoUrl: COAT_OF_ARMS_URL, blocks: [enBlock] }),
  }

  try {
    const result = await sendEyefindMail(payload)
    logger.info({ messageId: result.messageId }, 'Contact acknowledgement mail sent')
  } catch (err) {
    logger.error(
      { errorCode: err instanceof EyefindMailError ? err.code : undefined, err },
      'Failed to send contact acknowledgement mail'
    )
  }
}
