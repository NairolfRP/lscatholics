export class ReauthCancelledError extends Error {
  constructor() {
    super('Reauth cancelled')
    this.name = 'ReauthCancelledError'
  }
}

export function isReauthCancelled(error: unknown): error is ReauthCancelledError {
  return error instanceof ReauthCancelledError
}
