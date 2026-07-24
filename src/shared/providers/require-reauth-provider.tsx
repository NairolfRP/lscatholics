import type { PropsWithChildren } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { RequireReauthDialog } from '#/shared/components/auth/require-reauth-dialog'
import type { RoutePath } from '#/shared/types/route.types'
import { authClient } from '../integrations/auth/auth-client'

type ReauthContextValue = {
  requireFreshSession: () => Promise<void>
}

const ReauthContext = createContext<ReauthContextValue | null>(null)

export function RequireReauthProvider({
  children,
  cancelCallbackURL,
}: PropsWithChildren<{ cancelCallbackURL?: RoutePath }>) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const resolveRef = useRef<(() => void) | null>(null)
  const rejectRef = useRef<((reason?: unknown) => void) | null>(null)

  const requireFreshSession = (): Promise<void> =>
    new Promise((resolve, reject) => {
      resolveRef.current = resolve
      rejectRef.current = reject
      setOpen(true)
    })

  const handleConfirm = async () => {
    setOpen(false)
    await authClient.signOut()
    void authClient.signIn.oauth2({ providerId: 'gtaw', callbackURL: window.location.pathname })
  }

  const handleCancel = () => {
    if (cancelCallbackURL) {
      void router.navigate({ to: cancelCallbackURL, replace: true })
    }
    setOpen(false)
    rejectRef.current?.(new Error('Reauth cancelled'))
  }

  return (
    <ReauthContext value={{ requireFreshSession }}>
      {children}
      <RequireReauthDialog open={open} onConfirm={handleConfirm} onCancel={handleCancel} />
    </ReauthContext>
  )
}

export function useReauthContext() {
  const ctx = useContext(ReauthContext)
  if (!ctx) throw new Error('useReauthContext must be used within ReauthProvider')
  return ctx
}
