import { adminClient, customSessionClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import type { auth } from '#/server/integrations/auth.server'
import { ac, roles } from '#/shared/integrations/auth/access-control'
import { isFiveMNui } from '#/utils/fivem-client.ts'

export const authClient = createAuthClient({
  sessionOptions: {
    refetchOnWindowFocus: !isFiveMNui,
    refetchWhenOffline: false,
  },
  plugins: [
    adminClient({ ac, roles }),
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
})
