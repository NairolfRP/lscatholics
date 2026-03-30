import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'about-us': ExtractProps<(typeof import('../../inertia/pages/about-us.tsx'))['default']>
    'account/settings': ExtractProps<(typeof import('../../inertia/pages/account/settings.tsx'))['default']>
    'archbishop': ExtractProps<(typeof import('../../inertia/pages/archbishop.tsx'))['default']>
    'charities/index': ExtractProps<(typeof import('../../inertia/pages/charities/index.tsx'))['default']>
    'charities/programs/show': ExtractProps<(typeof import('../../inertia/pages/charities/programs/show.tsx'))['default']>
    'contact': ExtractProps<(typeof import('../../inertia/pages/contact.tsx'))['default']>
    'dashboard/events/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/create.tsx'))['default']>
    'dashboard/events/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/edit.tsx'))['default']>
    'dashboard/events/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/index.tsx'))['default']>
    'dashboard/events/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/show.tsx'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.tsx'))['default']>
    'dashboard/jobs/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/create.tsx'))['default']>
    'dashboard/jobs/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/edit.tsx'))['default']>
    'dashboard/jobs/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/index.tsx'))['default']>
    'dashboard/jobs/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/show.tsx'))['default']>
    'dashboard/posts/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/posts/create.tsx'))['default']>
    'dashboard/posts/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/posts/edit.tsx'))['default']>
    'dashboard/posts/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/posts/index.tsx'))['default']>
    'dashboard/posts/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/posts/show.tsx'))['default']>
    'dashboard/users/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/users/edit.tsx'))['default']>
    'dashboard/users/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/users/index.tsx'))['default']>
    'decrees/index': ExtractProps<(typeof import('../../inertia/pages/decrees/index.tsx'))['default']>
    'decrees/single': ExtractProps<(typeof import('../../inertia/pages/decrees/single.tsx'))['default']>
    'departments/index': ExtractProps<(typeof import('../../inertia/pages/departments/index.tsx'))['default']>
    'departments/single': ExtractProps<(typeof import('../../inertia/pages/departments/single.tsx'))['default']>
    'donate': ExtractProps<(typeof import('../../inertia/pages/donate.tsx'))['default']>
    'errors/not-found': ExtractProps<(typeof import('../../inertia/pages/errors/not-found.tsx'))['default']>
    'errors/server-error': ExtractProps<(typeof import('../../inertia/pages/errors/server-error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'jobs/application': ExtractProps<(typeof import('../../inertia/pages/jobs/application.tsx'))['default']>
    'jobs/index': ExtractProps<(typeof import('../../inertia/pages/jobs/index.tsx'))['default']>
    'jobs/single': ExtractProps<(typeof import('../../inertia/pages/jobs/single.tsx'))['default']>
    'parishes': ExtractProps<(typeof import('../../inertia/pages/parishes.tsx'))['default']>
    'payment-callback': ExtractProps<(typeof import('../../inertia/pages/payment-callback.tsx'))['default']>
    'posts/index': ExtractProps<(typeof import('../../inertia/pages/posts/index.tsx'))['default']>
    'posts/single': ExtractProps<(typeof import('../../inertia/pages/posts/single.tsx'))['default']>
    'privacy': ExtractProps<(typeof import('../../inertia/pages/privacy.tsx'))['default']>
    'readings': ExtractProps<(typeof import('../../inertia/pages/readings.tsx'))['default']>
    'register-parishioner': ExtractProps<(typeof import('../../inertia/pages/register-parishioner.tsx'))['default']>
    'scheduled_events/index': ExtractProps<(typeof import('../../inertia/pages/scheduled_events/index.tsx'))['default']>
    'scheduled_events/single': ExtractProps<(typeof import('../../inertia/pages/scheduled_events/single.tsx'))['default']>
    'services/all': ExtractProps<(typeof import('../../inertia/pages/services/all.tsx'))['default']>
    'services/anointing-of-the-sick': ExtractProps<(typeof import('../../inertia/pages/services/anointing-of-the-sick.tsx'))['default']>
    'services/benediction': ExtractProps<(typeof import('../../inertia/pages/services/benediction.tsx'))['default']>
    'services/christian-initiation': ExtractProps<(typeof import('../../inertia/pages/services/christian-initiation.tsx'))['default']>
    'services/conference-predication': ExtractProps<(typeof import('../../inertia/pages/services/conference-predication.tsx'))['default']>
    'services/confession': ExtractProps<(typeof import('../../inertia/pages/services/confession.tsx'))['default']>
    'services/exorcism': ExtractProps<(typeof import('../../inertia/pages/services/exorcism.tsx'))['default']>
    'services/funerals': ExtractProps<(typeof import('../../inertia/pages/services/funerals.tsx'))['default']>
    'services/marriage': ExtractProps<(typeof import('../../inertia/pages/services/marriage.tsx'))['default']>
    'services/mediation': ExtractProps<(typeof import('../../inertia/pages/services/mediation.tsx'))['default']>
    'services/offer-a-mass': ExtractProps<(typeof import('../../inertia/pages/services/offer-a-mass.tsx'))['default']>
    'services/quinceanera': ExtractProps<(typeof import('../../inertia/pages/services/quinceanera.tsx'))['default']>
    'services/service-layout': ExtractProps<(typeof import('../../inertia/pages/services/service-layout.tsx'))['default']>
    'vocations': ExtractProps<(typeof import('../../inertia/pages/vocations.tsx'))['default']>
  }
}
