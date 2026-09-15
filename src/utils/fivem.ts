import { getRequestHeaders } from '@tanstack/react-start/server'

export function isGameCEF() {
  const request = getRequestHeaders()

  return request.get('user-agent')?.includes('CitizenFX') ?? false
}
