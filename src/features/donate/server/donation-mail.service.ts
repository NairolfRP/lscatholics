import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'
import type { MailLetterBlock } from '#server/services/mail-template.service.ts'
import { escapeHtml, renderMailTemplate } from '#server/services/mail-template.service.ts'
import { socials } from '#shared/constants/socials.ts'

export const DONATION_CONFIRMATION_MAIL_SUBJECT =
  'Merci pour votre don — Gracias por su donación | LS Catholics'

const COAT_OF_ARMS_URL = 'https://i.imgur.com/6YJtfqY.png'
const FACE_BROWSER_URL = socials.facebrowser.href

export async function sendDonationConfirmationMail(data: DonationNotificationData): Promise<void> {
  const to = data.eyefindMail
  if (!to) return

  const fullName = `${data.firstname} ${data.lastname}`.trim()
  const amount = formatCurrency(data.amount)
  const isOrganization = data.isOrganization && !!data.organizationName
  const organizationName = data.organizationName ?? ''
  const escapedName = escapeHtml(fullName)
  const escapedAmount = escapeHtml(amount)
  const escapedOrganizationName = escapeHtml(organizationName)

  const orgDonationEn = isOrganization ? ` réalisé au nom de ${organizationName}` : ''
  const orgDonationEs = isOrganization ? ` realizada a nombre de ${organizationName}` : ''
  const orgDonationHtmlEn = isOrganization
    ? ` réalisé au nom de <strong>${escapedOrganizationName}</strong>`
    : ''
  const orgDonationHtmlEs = isOrganization
    ? ` realizada a nombre de <strong>${escapedOrganizationName}</strong>`
    : ''
  const orgPrayerEn = isOrganization ? ` Nous prierons également pour ${organizationName}.` : ''
  const orgPrayerEs = isOrganization ? ` También rezaremos por ${organizationName}.` : ''
  const orgPrayerHtmlEn = isOrganization
    ? ` Nous prierons également pour <strong>${escapedOrganizationName}</strong>.`
    : ''
  const orgPrayerHtmlEs = isOrganization
    ? ` También rezaremos por <strong>${escapedOrganizationName}</strong>.`
    : ''

  const enBlock: MailLetterBlock = {
    title: 'Archidiocèse de Los Santos',
    greeting: `Bonjour <strong>${escapedName}</strong>,`,
    intro: `L'Archidiocèse de Los Santos vous remercie de tout cœur pour votre don de <strong>${escapedAmount}</strong>${orgDonationHtmlEn}.`,
    amountLabel: 'Montant du don',
    amount: escapedAmount,
    paragraphs: [
      "Votre générosité est essentielle pour financer la mission de l'Église, la préservation de son patrimoine, le soutien aux prêtres et diacres, et les œuvres pour les plus vulnérables.",
      "Grâce à vous, l'Église est vivante et continue de propager son message d'Espérance, pour tous et pour toutes.",
      `N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables.${orgPrayerHtmlEn}`,
    ],
    blessing: 'Que la joie de Dieu vous comble !',
    close: 'Fraternellement,',
    signature: 'Archidiocèse de Los Santos',
    links: [{ label: 'Suivez-nous sur Facebrowser :', href: FACE_BROWSER_URL }],
    note: 'Ceci est un message automatique, merci de ne pas y répondre.',
  }

  const esBlock: MailLetterBlock = {
    title: 'Arquidiócesis de Los Santos',
    greeting: `Hola <strong>${escapedName}</strong>,`,
    intro: `La Arquidiócesis de Los Santos le agradece de corazón su donación de <strong>${escapedAmount}</strong>${orgDonationHtmlEs}.`,
    amountLabel: 'Monto de la donación',
    amount: escapedAmount,
    paragraphs: [
      'Su generosidad es fundamental para financiar la misión de la Iglesia, la preservación de su patrimonio, el apoyo a los sacerdotes y diáconos, y las obras para los más vulnerables.',
      'Gracias a usted, la Iglesia está viva y sigue difundiendo su mensaje de Esperanza, para todos y para todas.',
      `No olvide rezar por nosotros y por todo el Pueblo de Dios, especialmente por los más vulnerables.${orgPrayerHtmlEs}`,
    ],
    blessing: '¡Que la alegría de Dios lo llene!',
    close: 'Fraternalmente,',
    signature: 'Arquidiócesis de Los Santos',
    links: [{ label: 'Síguenos en Facebrowser:', href: FACE_BROWSER_URL }],
    note: 'Este es un mensaje automático, por favor no responda.',
  }

  const payload: SendEyefindMailInput = {
    to,
    subject: DONATION_CONFIRMATION_MAIL_SUBJECT,
    body: [
      `Bonjour ${fullName},`,
      '',
      `L'Archidiocèse de Los Santos vous remercie de tout cœur pour votre don de ${amount}${orgDonationEn}.`,
      '',
      "Votre générosité est essentielle pour financer la mission de l'Église, la préservation de son patrimoine, le soutien aux prêtres et diacres, et les œuvres pour les plus vulnérables.",
      '',
      "Grâce à vous, l'Église est vivante et continue de propager son message d'Espérance, pour tous et pour toutes.",
      '',
      `N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables.${orgPrayerEn}`,
      '',
      'Que la joie de Dieu vous comble !',
      '',
      'Fraternellement,',
      'Archidiocèse de Los Santos',
      '',
      'Suivez-nous sur Facebrowser : ' + FACE_BROWSER_URL,
      '',
      '————————————————————————————',
      '',
      `Hola ${fullName},`,
      '',
      `La Arquidiócesis de Los Santos le agradece de corazón su donación de ${amount}${orgDonationEs}.`,
      '',
      'Su generosidad es fundamental para financiar la misión de la Iglesia, la preservación de su patrimonio, el apoyo a los sacerdotes y diáconos, y las obras para los más vulnerables.',
      '',
      'Gracias a usted, la Iglesia está viva y sigue difundiendo su mensaje de Esperanza, para todos y para todas.',
      '',
      `No olvide rezar por nosotros y por todo el Pueblo de Dios, especialmente por los más vulnerables.${orgPrayerEs}`,
      '',
      '¡Que la alegría de Dios lo llene!',
      '',
      'Fraternalmente,',
      'Arquidiócesis de Los Santos',
      '',
      'Síguenos en Facebrowser: ' + FACE_BROWSER_URL,
    ].join('\n'),
    html: renderMailTemplate({ logoUrl: COAT_OF_ARMS_URL, blocks: [enBlock, esBlock] }),
  }

  try {
    const result = await sendEyefindMail(payload)
    logger.info(
      { amount: data.amount, messageId: result.messageId },
      'Donation confirmation mail sent'
    )
  } catch (err) {
    logger.error(
      {
        amount: data.amount,
        errorCode: err instanceof EyefindMailError ? err.code : undefined,
        err,
      },
      'Failed to send donation confirmation mail'
    )
  }
}
