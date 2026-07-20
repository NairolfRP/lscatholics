import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/account/')({
  beforeLoad: () => {
    throw redirect({ to: '/account/settings', replace: true })
  },
})
