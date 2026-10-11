const FONT_FAMILY = "Georgia,'Times New Roman',serif"
const PRIMARY_COLOR = '#0693e3'
const ACCENT_COLOR = '#daa520'
const PAGE_BACKGROUND = '#faf7f0'
const CARD_BORDER = '#e7dfd0'
const TEXT_COLOR = '#111827'
const MUTED_COLOR = '#6f737c'
const LABEL_COLOR = '#8a6d1f'
const DEFAULT_SEPARATOR = '❦'

export interface MailLink {
  label: string
  href: string
}

export interface MailLetterBlock {
  title: string
  greeting: string
  intro: string
  amountLabel?: string
  amount?: string
  paragraphs: string[]
  blessing?: string
  close?: string
  signature?: string
  links?: MailLink[]
  note?: string
}

export interface MailTemplateOptions {
  logoUrl?: string
  separator?: string
  blocks: MailLetterBlock[]
}

export function renderMailTemplate({
  logoUrl,
  separator = DEFAULT_SEPARATOR,
  blocks,
}: MailTemplateOptions): string {
  const separatorHtml =
    blocks.length > 1
      ? `<div style="text-align:center; margin:26px 0 24px; color:${ACCENT_COLOR}; font-size:14px;">${separator}</div>`
      : ''
  return [
    `<div style="background:${PAGE_BACKGROUND}; padding:32px 14px; font-family:${FONT_FAMILY}; color:${TEXT_COLOR}; font-size:15px; line-height:1.7;">`,
    `<div style="max-width:620px; margin:0 auto;">`,
    blocks.map((block) => renderLetterBlock(block, logoUrl)).join(separatorHtml),
    `</div>`,
    `</div>`,
  ].join('')
}

function renderLetterBlock(block: MailLetterBlock, logoUrl?: string): string {
  const header = [
    `<div style="background:${PRIMARY_COLOR}; color:#fff; text-align:center; padding:32px 20px 28px; border-top:5px solid ${ACCENT_COLOR}; border-radius:14px 14px 0 0;">`,
    logoUrl
      ? `<img src="${logoUrl}" alt="" style="width:68px; height:auto; margin:0 auto 12px; display:block;">`
      : '',
    `<div style="font-size:22px; font-weight:bold; letter-spacing:1px;">${block.title}</div>`,
    `</div>`,
  ].join('')

  const body = [
    `<div style="background:#fff; padding:30px; border:1px solid ${CARD_BORDER}; border-top:none; border-radius:0 0 14px 14px;">`,
    `<p style="margin:0 0 16px;">${block.greeting}</p>`,
    `<p style="margin:0 0 16px;">${block.intro}</p>`,
    block.amount && block.amountLabel
      ? `<div style="margin:22px 0; padding:18px 0; border-top:1px solid ${CARD_BORDER}; border-bottom:1px solid ${CARD_BORDER}; text-align:center;"><div style="font-size:10px; letter-spacing:3px; color:${LABEL_COLOR}; text-transform:uppercase;">${block.amountLabel}</div><div style="font-size:28px; font-weight:bold; color:${PRIMARY_COLOR}; margin-top:6px;">${block.amount}</div></div>`
      : '',
    ...block.paragraphs.map((paragraph) => `<p style="margin:0 0 16px;">${paragraph}</p>`),
    block.blessing
      ? `<div style="margin:22px 0 20px; text-align:center; font-style:italic; font-size:16px; color:${PRIMARY_COLOR}; line-height:1.6;">${block.blessing}</div>`
      : '',
    block.close ? `<p style="margin:0;">${block.close}</p>` : '',
    block.signature ? `<p style="margin:2px 0 0; font-weight:bold;">${block.signature}</p>` : '',
  ]

  const footer =
    block.links?.length || block.note
      ? `<div style="margin-top:22px; padding-top:16px; border-top:1px solid ${CARD_BORDER}; text-align:left; font-size:12px; color:${MUTED_COLOR}; line-height:1.8;">${
          block.links?.length
            ? block.links
                .map(
                  (link) =>
                    `${link.label}<br><a href="${link.href}" style="color:${PRIMARY_COLOR}; font-weight:bold; text-decoration:none;">${link.href}</a>`
                )
                .join(`<div style="margin-top:12px;"></div>`)
            : ''
        }${block.note ? `<div style="margin-top:8px; font-size:11px;">${block.note}</div>` : ''}</div>`
      : ''

  return `${header}${body.join('')}${footer}</div>`
}

export function escapeHtml(value: string): string {
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
