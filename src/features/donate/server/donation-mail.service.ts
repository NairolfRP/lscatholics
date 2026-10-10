import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'

export const DONATION_CONFIRMATION_MAIL_SUBJECT =
  'Merci pour votre don — Gracias por su donación | LS Catholics'

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
      'Suivez-nous sur Facebrowser : https://face-fr.gta.world/page/lscatholics',
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
      'Síguenos en Facebrowser: https://face-fr.gta.world/page/lscatholics',
    ].join('\n'),
    html: [
      `<p>Bonjour <strong>${escapedName}</strong>,</p>`,
      `<p>L'Archidiocèse de Los Santos vous remercie de tout cœur pour votre don de <strong>${escapedAmount}</strong>${orgDonationHtmlEn}.</p>`,
      `<p>Votre générosité est essentielle pour financer la mission de l'Église, la préservation de son patrimoine, le soutien aux prêtres et diacres, et les œuvres pour les plus vulnérables.</p>`,
      `<p>Grâce à vous, l'Église est vivante et continue de propager son message d'Espérance, pour tous et pour toutes.</p>`,
      `<p>N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables.${orgPrayerHtmlEn}</p>`,
      `<p><strong>Que la joie de Dieu vous comble !</strong></p>`,
      `<p>Fraternellement,<br>Archidiocèse de Los Santos</p>`,
      '<p>Suivez-nous sur Facebrowser : <a href="https://face-fr.gta.world/page/lscatholics">https://face-fr.gta.world/page/lscatholics</a></p>',
      `<br>`,
      '————————————————————————————',
      `<br>`,
      `<p>Hola <strong>${escapedName}</strong>,</p>`,
      `<p>La Arquidiócesis de Los Santos le agradece de corazón su donación de <strong>${escapedAmount}</strong>${orgDonationHtmlEs}.</p>`,
      `<p>Su generosidad es fundamental para financiar la misión de la Iglesia, la preservación de su patrimonio, el apoyo a los sacerdotes y diáconos, y las obras para los más vulnerables.</p>`,
      `<p>Gracias a usted, la Iglesia está viva y sigue difundiendo su mensaje de Esperanza, para todos y para todas.</p>`,
      `<p>No olvide rezar por nosotros y por todo el Pueblo de Dios, especialmente por los más vulnerables.${orgPrayerHtmlEs}</p>`,
      `<p><strong>¡Que la alegría de Dios lo llene!</strong></p>`,
      `<p>Fraternalmente,<br>Arquidiócesis de Los Santos</p>`,
      '<p>Síguenos en Facebrowser: <a href="https://face-fr.gta.world/page/lscatholics">https://face-fr.gta.world/page/lscatholics</a></p>',
    ].join(''),
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[char]
  })
}
