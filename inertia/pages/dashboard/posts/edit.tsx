import Head from '@/shared/components/app-head'
import {Button} from '@/shared/components/ui/button'
import type {InertiaProps} from '@/shared/types/pages'
import {Link} from '@adonisjs/inertia/react'
import {ArrowLeft} from 'lucide-react'
import type {Data} from '@generated/data'
import {EditPostForm} from '@/features/posts/components/dashboard/form/edit-post-form'
import {withDashboardLayout} from '@/shared/components/layout'
import {urlFor} from '@/lib/client'

type PageProps = InertiaProps<{
  post: Data.Posts.Post.Variants['allFields']
}>

export default withDashboardLayout<PageProps>(
  ({ post }: PageProps) => {
    return (
      <>
        <Head title="Modifier l'article" />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link route="dashboard.dashboard_posts.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier l'article</h1>
              <p className="text-gray-500 dark:text-gray-400">{post.title}</p>
            </div>
          </div>

          <EditPostForm />
        </div>
      </>
    )
  },
  {
    breadcrumb: (props) => [
      { label: 'Articles', href: urlFor('dashboard.dashboard_posts.index') },
      { label: `Modifier « ${props.post.title} »` },
    ],
  }
)
