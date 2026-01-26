import vine from '@vinejs/vine'

export const noHtmlTags = vine.createRule((value, _options, field) => {
  if (typeof value !== 'string') return

  if (/<\/?[a-z][\s\S]*>/i.test(value)) {
    field.report('Les balises HTML ne sont pas autorisées.', 'noHtml', field)
  }
})
