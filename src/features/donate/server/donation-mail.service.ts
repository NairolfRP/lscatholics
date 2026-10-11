import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'

export const DONATION_CONFIRMATION_MAIL_SUBJECT =
  'Merci pour votre don — Gracias por su donación | LS Catholics'

const COAT_OF_ARMS_URL = 'https://i.imgur.com/6YJtfqY.png'

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

  const enBlock: MailLanguageBlock = {
    title: 'Archidiocèse de Los Santos',
    greeting: `Bonjour <strong>${escapedName}</strong>,`,
    thanks: `L'Archidiocèse de Los Santos vous remercie de tout cœur pour votre don de <strong>${escapedAmount}</strong>${orgDonationHtmlEn}.`,
    donationLabel: 'Montant du don',
    amount: escapedAmount,
    generosity:
      "Votre générosité est essentielle pour financer la mission de l'Église, la préservation de son patrimoine, le soutien aux prêtres et diacres, et les œuvres pour les plus vulnérables.",
    hope: "Grâce à vous, l'Église est vivante et continue de propager son message d'Espérance, pour tous et pour toutes.",
    prayer: `N'oubliez pas de prier pour nous et tout le Peuple de Dieu, particulièrement pour les plus vulnérables.${orgPrayerHtmlEn}`,
    blessing: 'Que la joie de Dieu vous comble !',
    beforeSignature: 'Fraternellement,',
    signature: 'Archidiocèse de Los Santos',
    followLabel: 'Suivez-nous sur Facebrowser :',
    followLink: 'https://face-fr.gta.world/page/lscatholics',
    note: 'Ceci est un message automatique, merci de ne pas y répondre.',
  }

  const esBlock: MailLanguageBlock = {
    title: 'Arquidiócesis de Los Santos',
    greeting: `Hola <strong>${escapedName}</strong>,`,
    thanks: `La Arquidiócesis de Los Santos le agradece de corazón su donación de <strong>${escapedAmount}</strong>${orgDonationHtmlEs}.`,
    donationLabel: 'Monto de la donación',
    amount: escapedAmount,
    generosity:
      'Su generosidad es fundamental para financiar la misión de la Iglesia, la preservación de su patrimonio, el apoyo a los sacerdotes y diáconos, y las obras para los más vulnerables.',
    hope: 'Gracias a usted, la Iglesia está viva y sigue difundiendo su mensaje de Esperanza, para todos y para todas.',
    prayer: `No olvide rezar por nosotros y por todo el Pueblo de Dios, especialmente por los más vulnerables.${orgPrayerHtmlEs}`,
    blessing: '¡Que la alegría de Dios lo llene!',
    beforeSignature: 'Fraternalmente,',
    signature: 'Arquidiócesis de Los Santos',
    followLabel: 'Síguenos en Facebrowser:',
    followLink: 'https://face-fr.gta.world/page/lscatholics',
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
      `<div style="background:#faf7f0; padding:32px 14px; font-family:Georgia,'Times New Roman',serif; color:#111827; font-size:15px; line-height:1.7;">`,
      `<div style="max-width:620px; margin:0 auto;">`,
      renderLanguageSection(enBlock),
      `<div style="text-align:center; margin:26px 0 24px; color:#daa520; font-size:14px;">❦</div>`,
      renderLanguageSection(esBlock),
      `</div>`,
      `</div>`,
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

interface MailLanguageBlock {
  title: string
  greeting: string
  thanks: string
  donationLabel: string
  amount: string
  generosity: string
  hope: string
  prayer: string
  blessing: string
  beforeSignature: string
  signature: string
  followLabel: string
  followLink: string
  note: string
}

function renderLanguageSection(lang: MailLanguageBlock): string {
  return [
    `<div style="background:#0693e3; color:#fff; text-align:center; padding:32px 20px 28px; border-top:5px solid #daa520; border-radius:14px 14px 0 0;">`,
    `<img src="${COAT_OF_ARMS_URL}" alt="" style="width:68px; height:auto; margin:0 auto 12px; display:block;">`,
    `<div style="font-size:22px; font-weight:bold; letter-spacing:1px;">${lang.title}</div>`,
    `</div>`,
    `<div style="background:#fff; padding:30px; border:1px solid #e7dfd0; border-top:none; border-radius:0 0 14px 14px;">`,
    `<p style="margin:0 0 16px;">${lang.greeting}</p>`,
    `<p style="margin:0;">${lang.thanks}</p>`,
    `<div style="margin:22px 0; padding:18px 0; border-top:1px solid #e7dfd0; border-bottom:1px solid #e7dfd0; text-align:center;">`,
    `<div style="font-size:10px; letter-spacing:3px; color:#8a6d1f; text-transform:uppercase;">${lang.donationLabel}</div>`,
    `<div style="font-size:28px; font-weight:bold; color:#0693e3; margin-top:6px;">${lang.amount}</div>`,
    `</div>`,
    `<p style="margin:0 0 16px;">${lang.generosity}</p>`,
    `<p style="margin:0 0 16px;">${lang.hope}</p>`,
    `<p style="margin:0 0 16px;">${lang.prayer}</p>`,
    `<div style="margin:22px 0 20px; text-align:center; font-style:italic; font-size:16px; color:#0693e3; line-height:1.6;">${lang.blessing}</div>`,
    `<p style="margin:0;">${lang.beforeSignature}</p>`,
    `<p style="margin:2px 0 0; font-weight:bold;">${lang.signature}</p>`,
    `<div style="margin-top:22px; padding-top:16px; border-top:1px solid #e7dfd0; text-align:center; font-size:12px; color:#6f737c; line-height:1.8;">`,
    `${lang.followLabel}<br>`,
    `<a href="${lang.followLink}" style="color:#0693e3; font-weight:bold; text-decoration:none;">${lang.followLink}</a>`,
    `<div style="margin-top:8px; font-size:11px;">${lang.note}</div>`,
    `</div>`,
    `</div>`,
  ].join('')
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
