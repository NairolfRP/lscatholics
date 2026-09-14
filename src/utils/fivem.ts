import { getRequest } from '@tanstack/react-start/server'

export function isCEFRequest(): boolean {
  try {
    const request = getRequest()
    // oxlint-disable-next-line typescript/no-unnecessary-condition
    if (!request) return false
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const origin = request.headers.get('origin') || ''
    return (
      userAgent.includes('CitizenFX') &&
      (referer.startsWith('https://cfx-nui') ||
        origin.startsWith('https://cfx-nui') ||
        referer.startsWith('nui://') ||
        origin.startsWith('nui://'))
    )
  } catch {
    return false
  }
}
