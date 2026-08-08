import { TanStackDevtools } from '@tanstack/react-devtools'
import { formDevtoolsPlugin } from '@tanstack/react-form-devtools'
import { useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import TanStackQueryDevtools from '#shared/integrations/tanstack-query/devtools.tsx'

export function AppDevtools() {
  const router = useRouter()

  return (
    <TanStackDevtools
      config={{
        position: 'bottom-left',
        hideUntilHover: true,
      }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel router={router} />,
        },
        TanStackQueryDevtools,
        formDevtoolsPlugin(),
      ]}
    />
  )
}
