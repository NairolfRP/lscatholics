import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DashboardPostForm } from '#/features/post/components/dashboard-post-form.tsx'
import type { EditPostFormInput } from '#/features/post/schemas/post.schema.ts'
import { editPostSchema } from '#/features/post/schemas/post.schema.ts'
import { canEditPost } from '#/features/post/utils/post.utils.ts'
import { getDashboardPostFn, updatePostFn } from '#/server-fn/post.functions.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/posts/edit/$id')({
  beforeLoad: async ({ params, context }) => {
    const post = await getDashboardPostFn({ data: params.id })
    const isAuthorized = canEditPost({ user: context.gameContext.user, authorId: post.authorId })

    if (!isAuthorized) {
      throw redirect({ to: '/dashboard/posts', replace: true })
    }

    return { post }
  },
  loader: ({ context }) => ({ post: context.post }),
  head: () => ({ meta: pageMetadata("Modifier l'article") }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { post } = Route.useLoaderData()

  const form = useAppForm({
    validators: {
      onChange: editPostSchema,
    },
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    defaultValues: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? undefined,
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
      status: post.status,
    } as EditPostFormInput,
    onSubmit: async ({ value, formApi }) => {
      const result = await updatePostFn({ data: { postId: post.id, ...value } })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.error('Une erreur est survenue')
      }

      toast.success('Article mis à jour !')
      await router.invalidate()
      formApi.reset()
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Modifier l'article"
          description={post.title}
          backButton={{ to: '/dashboard/posts', preload: false }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardPostForm form={form} variant="edit" />
        </div>
      </div>
    </div>
  )
}
