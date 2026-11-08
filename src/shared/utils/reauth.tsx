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
  })

  if (!confirmed) {
    throw new ReauthCancelledError()
  }

  await authClient.signOut()
  void authClient.signIn.social({ provider: 'gtaw', callbackURL: window.location.pathname })
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
