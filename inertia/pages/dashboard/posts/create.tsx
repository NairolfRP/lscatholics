import Head from '@/shared/components/app-head'
import { Button } from '@/shared/components/ui/button'
import type { InertiaProps } from '@/shared/types/pages'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { CreatePostForm } from '@/features/posts/components/dashboard/form/create-post-form'
import { withDashboardLayout } from '@/shared/components/layout'
import { urlFor } from '@/lib/client'

type PageProps = InertiaProps

export default withDashboardLayout<PageProps>(
  () => {
    return (
      <>
        <Head title="Créer un article" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link route="dashboard.dashboard_posts.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Créer un article</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Ajoutez un nouvel article à votre site
              </p>
            </div>
          </div>

          <CreatePostForm />
        </div>
      </>
    )
  },
  {
    breadcrumb: [
      { label: 'Articles', href: urlFor('dashboard.dashboard_posts.index') },
      { label: 'Nouveau' },
    ],
  }
)
