import {
  adminClient,
  customSessionClient,
  genericOAuthClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '#/server/integrations/auth.server'
import { ac, roles } from '#/shared/integrations/auth/access-control'

export const authClient = createAuthClient({
  plugins: [
    genericOAuthClient(),
    adminClient({ ac, roles }),
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
})
