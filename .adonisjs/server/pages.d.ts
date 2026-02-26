import '@adonisjs/inertia/types'

import type { VNodeProps, AllowedComponentProps, ComponentInstance } from 'vue'

type ExtractProps<T> = Omit<
  ComponentInstance<T>['$props'],
  keyof VNodeProps | keyof AllowedComponentProps
>

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'about_us': ExtractProps<(typeof import('../../inertia/pages/about_us.vue'))['default']>
    'archbishop': ExtractProps<(typeof import('../../inertia/pages/archbishop.vue'))['default']>
    'catholic-charities': ExtractProps<(typeof import('../../inertia/pages/catholic-charities.vue'))['default']>
    'contact': ExtractProps<(typeof import('../../inertia/pages/contact.vue'))['default']>
    'dashboard/articles/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/articles/create.vue'))['default']>
    'dashboard/articles/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/articles/edit.vue'))['default']>
    'dashboard/articles/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/articles/index.vue'))['default']>
    'dashboard/articles/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/articles/show.vue'))['default']>
    'dashboard/events/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/create.vue'))['default']>
    'dashboard/events/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/edit.vue'))['default']>
    'dashboard/events/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/index.vue'))['default']>
    'dashboard/events/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/events/show.vue'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.vue'))['default']>
    'dashboard/jobs/create': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/create.vue'))['default']>
    'dashboard/jobs/edit': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/edit.vue'))['default']>
    'dashboard/jobs/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/index.vue'))['default']>
    'dashboard/jobs/show': ExtractProps<(typeof import('../../inertia/pages/dashboard/jobs/show.vue'))['default']>
    'departments/all': ExtractProps<(typeof import('../../inertia/pages/departments/all.vue'))['default']>
    'departments/single': ExtractProps<(typeof import('../../inertia/pages/departments/single.vue'))['default']>
    'donate': ExtractProps<(typeof import('../../inertia/pages/donate.vue'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.vue'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.vue'))['default']>
    'events/all': ExtractProps<(typeof import('../../inertia/pages/events/all.vue'))['default']>
    'events/single': ExtractProps<(typeof import('../../inertia/pages/events/single.vue'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.vue'))['default']>
    'jobs/all': ExtractProps<(typeof import('../../inertia/pages/jobs/all.vue'))['default']>
    'jobs/application': ExtractProps<(typeof import('../../inertia/pages/jobs/application.vue'))['default']>
    'jobs/single': ExtractProps<(typeof import('../../inertia/pages/jobs/single.vue'))['default']>
    'news/all': ExtractProps<(typeof import('../../inertia/pages/news/all.vue'))['default']>
    'news/single': ExtractProps<(typeof import('../../inertia/pages/news/single.vue'))['default']>
    'parishes': ExtractProps<(typeof import('../../inertia/pages/parishes.vue'))['default']>
    'payment-callback': ExtractProps<(typeof import('../../inertia/pages/payment-callback.vue'))['default']>
    'privacy': ExtractProps<(typeof import('../../inertia/pages/privacy.vue'))['default']>
    'profile': ExtractProps<(typeof import('../../inertia/pages/profile.vue'))['default']>
    'readings': ExtractProps<(typeof import('../../inertia/pages/readings.vue'))['default']>
    'register-parishioner': ExtractProps<(typeof import('../../inertia/pages/register-parishioner.vue'))['default']>
    'services/all': ExtractProps<(typeof import('../../inertia/pages/services/all.vue'))['default']>
    'services/anointing-of-the-sick': ExtractProps<(typeof import('../../inertia/pages/services/anointing-of-the-sick.vue'))['default']>
    'services/benediction': ExtractProps<(typeof import('../../inertia/pages/services/benediction.vue'))['default']>
    'services/christian-initiation': ExtractProps<(typeof import('../../inertia/pages/services/christian-initiation.vue'))['default']>
    'services/conference-predication': ExtractProps<(typeof import('../../inertia/pages/services/conference-predication.vue'))['default']>
    'services/confession': ExtractProps<(typeof import('../../inertia/pages/services/confession.vue'))['default']>
    'services/exorcism': ExtractProps<(typeof import('../../inertia/pages/services/exorcism.vue'))['default']>
    'services/funerals': ExtractProps<(typeof import('../../inertia/pages/services/funerals.vue'))['default']>
    'services/marriage': ExtractProps<(typeof import('../../inertia/pages/services/marriage.vue'))['default']>
    'services/mediation': ExtractProps<(typeof import('../../inertia/pages/services/mediation.vue'))['default']>
    'services/offer-a-mass': ExtractProps<(typeof import('../../inertia/pages/services/offer-a-mass.vue'))['default']>
    'services/quinceanera': ExtractProps<(typeof import('../../inertia/pages/services/quinceanera.vue'))['default']>
    'services/ServiceLayout': ExtractProps<(typeof import('../../inertia/pages/services/ServiceLayout.vue'))['default']>
    'vocations': ExtractProps<(typeof import('../../inertia/pages/vocations.vue'))['default']>
  }
}
