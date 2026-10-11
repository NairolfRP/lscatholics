import { APP_PRODUCTION_URL } from '#/config/app.constants.ts'
import type { GiftOrderNotificationData } from '#/features/gift-shop/types/gift-shop.types.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { SendEyefindMailInput } from '#server/services/eyefind-mail.service.ts'
import { EyefindMailError, sendEyefindMail } from '#server/services/eyefind-mail.service.ts'
import type { MailLetterBlock } from '#server/services/mail-template.service.ts'
import { escapeHtml, renderMailTemplate } from '#server/services/mail-template.service.ts'
import { socials } from '#shared/constants/socials.ts'

const COAT_OF_ARMS_URL = 'https://i.imgur.com/6YJtfqY.png'
const FACE_BROWSER_URL = socials.facebrowser.href
const RECAP_BORDER = '#e7dfd0'
const RECAP_MUTED = '#6f737c'

export const GIFT_ORDER_CONFIRMATION_MAIL_SUBJECT =
  'Confirmation de votre commande - Boutique de la Cathédrale'

export async function sendGiftOrderConfirmationMail(
  data: GiftOrderNotificationData
): Promise<void> {
  const to = data.eyefindMail
  if (!to) return

  const fullName = `${data.firstname} ${data.lastname}`.trim()
  const amount = formatCurrency(data.amount)
  const escapedName = escapeHtml(fullName)
  const escapedReference = escapeHtml(data.reference)
  const escapedAddress = escapeHtml(data.address)
  const escapedAmount = escapeHtml(amount)

  const recapRows = data.items
    .map((item) => {
      const lineTotal = escapeHtml(formatCurrency(item.price * item.quantity))
      return `<tr><td style="padding:6px 0; border-bottom:1px solid ${RECAP_BORDER};">${escapeHtml(item.productName)} <span style="color:${RECAP_MUTED};">× ${item.quantity}</span></td><td style="padding:6px 0; border-bottom:1px solid ${RECAP_BORDER}; text-align:right; white-space:nowrap;">${lineTotal}</td></tr>`
    })
    .join('')
  const recap = `<table style="width:100%; border-collapse:collapse; font-size:14px;"><tbody>${recapRows}</tbody></table>`

  const block: MailLetterBlock = {
    title: 'Boutique de la Cathédrale',
    greeting: `Bonjour <strong>${escapedName}</strong>,`,
    intro: `Nous avons le plaisir de vous confirmer que votre commande <strong>${escapedReference}</strong> a bien été enregistrée et réglée.`,
    recap,
    amountLabel: 'Total réglé',
    amount: escapedAmount,
    paragraphs: [
      `Votre commande sera préparée puis livrée à l'adresse suivante : <strong>${escapedAddress}</strong>.`,
      "Pour toute question concernant votre commande, n'hésitez pas à nous recontacter en mentionnant votre référence.",
    ],
    close: 'Fraternellement,',
    signature: 'Boutique de la Cathédrale',
    links: [
      { label: 'Retrouvez-nous sur :', href: APP_PRODUCTION_URL },
      { label: 'Suivez-nous sur Facebrowser :', href: FACE_BROWSER_URL },
      { label: 'Encuéntranos en:', href: APP_PRODUCTION_URL },
      { label: 'Síguenos en Facebrowser:', href: FACE_BROWSER_URL },
    ],
    note: 'Ceci est un message automatique, merci de ne pas y répondre.',
  }

  const itemLines = data.items.map(
    (item) =>
      `- ${item.productName} × ${item.quantity} — ${formatCurrency(item.price * item.quantity)}`
  )

  const payload: SendEyefindMailInput = {
    to,
    subject: GIFT_ORDER_CONFIRMATION_MAIL_SUBJECT,
    body: [
      `Bonjour ${fullName},`,
      '',
      `Nous avons le plaisir de vous confirmer que votre commande ${data.reference} a bien été enregistrée et réglée.`,
      '',
      'Articles :',
      ...itemLines,
      '',
      `Total réglé : ${amount}`,
      '',
      `Votre commande sera préparée puis livrée à l'adresse suivante : ${data.address}.`,
      '',
      "Pour toute question concernant votre commande, n'hésitez pas à nous recontacter en mentionnant votre référence.",
      '',
      'Fraternellement,',
      'Boutique de la Cathédrale',
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
    html: renderMailTemplate({ logoUrl: COAT_OF_ARMS_URL, blocks: [block] }),
  }

  try {
    const result = await sendEyefindMail(payload)
    logger.info(
      { reference: data.reference, messageId: result.messageId },
      'Gift order confirmation mail sent'
    )
  } catch (err) {
    logger.error(
      {
        reference: data.reference,
        errorCode: err instanceof EyefindMailError ? err.code : undefined,
        err,
      },
      'Failed to send gift order confirmation mail'
    )
  }
}
