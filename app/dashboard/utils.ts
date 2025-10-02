import pkgSanitizeHtml from 'sanitize-html'

export function sanitizeHtml(html: string): string {
  return pkgSanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
  })
}
