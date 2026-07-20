import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSessionFn } from '#/server-fn/auth.functions'
import { parseCsvString } from '#/utils/string'

export const Route = createFileRoute('/dashboard/users')({
  beforeLoad: async () => {
    const session = await getSessionFn()

    const isAdmin = session!.user.role
      ? parseCsvString(session!.user.role).includes('admin')
      : false

    if (!isAdmin) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
})
