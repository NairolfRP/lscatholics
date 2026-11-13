export type ParsedUserAgent = {
  label: string
  device: 'desktop' | 'mobile' | 'tablet' | 'unknown'
}

export function parseUserAgent(ua: string | null | undefined): ParsedUserAgent {
  const value = (ua ?? '').trim()
  if (!value) {
    return { label: 'Appareil inconnu', device: 'unknown' }
  }

  let browser = 'Navigateur inconnu'
  if (/Edg\//i.test(value)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(value)) browser = 'Opera'
  else if (/Chrome\//i.test(value) && !/Chromium/i.test(value)) browser = 'Chrome'
  else if (/Safari\//i.test(value) && !/Chrome/i.test(value)) browser = 'Safari'
  else if (/Firefox\//i.test(value)) browser = 'Firefox'
  else if (/Chromium/i.test(value)) browser = 'Chromium'

  let os = ''
  if (/Windows/i.test(value)) os = 'Windows'
  else if (/Mac OS X|Macintosh/i.test(value)) os = 'macOS'
  else if (/Android/i.test(value)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(value)) os = 'iOS'
  else if (/Linux/i.test(value)) os = 'Linux'

  let device: ParsedUserAgent['device'] = 'desktop'
  if (/iPad|Tablet/i.test(value)) device = 'tablet'
  else if (/Mobile|Android.*Mobile|iPhone|iPod/i.test(value)) device = 'mobile'

  const parts = [browser, os].filter(Boolean)
  return { label: parts.join(' sur ') || 'Appareil inconnu', device }
}
