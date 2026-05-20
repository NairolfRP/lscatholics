import { createTuyau } from '@tuyau/core/client'
import { registry } from '@generated/registry'
import { createTuyauReactQueryClient } from '@tuyau/react-query'

export const client = createTuyau({
  baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:3333',
  registry,
  headers: { Accept: 'application/json' },
  credentials: 'include',
})
export const api = createTuyauReactQueryClient({ client })

export const urlFor = client.urlFor
