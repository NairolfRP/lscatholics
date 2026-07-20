import {
  adminClient,
  customSessionClient,
  genericOAuthClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '#/server/integrations/auth.server'

export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
})
