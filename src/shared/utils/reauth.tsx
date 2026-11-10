import { ShieldAlert } from 'lucide-react'
import { ConfirmDialog } from '#/shared/components/callable/confirm-dialog'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { ReauthCancelledError } from './reauth-error'

export function isSessionNotFresh(error: unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error) || !('status' in error))
    return false
  return error.code === 'SESSION_NOT_FRESH' && error.status === 403
}

export async function requireFreshSession(): Promise<void> {
  const confirmed = await ConfirmDialog.call({
    title: 'Session trop ancienne',
    description:
      "Pour des raisons de sécurité, vous devez rafraichir votre session avant d'effectuer cette action. Vous allez être redirigé vers le service de connexion, puis automatiquement renvoyé ici.",
    icon: <ShieldAlert className="text-warning" />,
    confirmLabel: 'Se ré-authentifier',
    confirmSubmittingLabel: 'Redirection...',
    action: async () => {
      const { error: signOutError } = await authClient.signOut()
      if (signOutError) {
        return { error: true, message: 'Impossible de rafraîchir votre session' }
      }

      const { error: signInError } = await authClient.signIn.social({
        provider: 'gtaw',
        callbackURL: window.location.pathname,
        errorCallbackURL: window.location.href,
      })
      if (signInError) {
        return { error: true, message: 'Impossible de vous rediriger vers la connexion' }
      }

      // Keep the dialog pending while the browser redirects.
      return await new Promise<never>(() => undefined)
    },
  })

  if (!confirmed) {
    throw new ReauthCancelledError()
  }
}

export async function withFreshSession<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (!isSessionNotFresh(error)) {
      throw error
    }

    await requireFreshSession()
    return fn()
  }
}
