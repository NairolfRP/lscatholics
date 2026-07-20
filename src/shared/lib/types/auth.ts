import type { auth } from '#/server/integrations/auth.server'

export type Session = typeof auth.$Infer.Session

export type User = typeof auth.$Infer.Session.user
