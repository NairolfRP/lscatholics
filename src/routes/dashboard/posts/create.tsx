import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DashboardPostForm } from '#/features/post/components/dashboard-post-form.tsx'
import type { CreatePostFormInput } from '#/features/post/schemas/post.schema.ts'
import { createPostSchema } from '#/features/post/schemas/post.schema.ts'
import { createPostFn } from '#/server-fn/post.functions.ts'
import { toast } from '#/shared/components/ui/toast'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/posts/create')({
  head: () => ({ meta: pageMetadata('Créer un article') }),
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'post', 'create')) {
      throw redirect({ to: '/dashboard/posts', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()
  const form = useAppForm({
    validators: {
      onChange: createPostSchema,
    },
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      status: POST_STATUS.DRAFT,
      publishedAt: null,
    } as CreatePostFormInput,
    onSubmit: async ({ value, formApi }) => {
      const result = await createPostFn({ data: value })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.error(result.error)
      }

      await queryClient.invalidateQueries({ queryKey: ['posts'] })

      if (result.postId) {
        void navigate({ to: '/dashboard/posts/show/$id', params: { id: result.postId } })
      } else {
        void navigate({ to: '/dashboard/posts' })
      }
      toast.success('Article créé !')
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Créer un article"
          description="Ajoutez un nouvel article sur l'application"
          backButton={{
            'to': '/dashboard/posts',
            'aria-label': "Retour sur la page d'administration des articles",
            'preload': false,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardPostForm form={form as never} variant="create" />
        </div>
      </div>
    </div>
  )
}
