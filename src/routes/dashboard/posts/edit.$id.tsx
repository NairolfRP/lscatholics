import { useMutation } from '@tanstack/react-query'
import { createFileRoute, isNotFound, notFound, redirect, useRouter } from '@tanstack/react-router'
import { SendIcon } from 'lucide-react'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { DashboardPostForm } from '#/features/post/components/dashboard-post-form.tsx'
import type { EditPostFormInput } from '#/features/post/schemas/post.schema.ts'
import { editPostSchema } from '#/features/post/schemas/post.schema.ts'
import {
  getDashboardPostFn,
  sendPostNotificationFn,
  updatePostFn,
} from '#/server-fn/post.functions.ts'
import { ActionButton } from '#/shared/components/action-button.tsx'
import { toast } from '#/shared/components/ui/toast'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'
import { POST_STATUS } from '#shared/constants/post-status.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/posts/edit/$id')({
  beforeLoad: async ({ params, context }) => {
    if (!hasPermission(context.gameContext.permissions, 'post', 'update')) {
      throw redirect({ to: '/dashboard/posts', replace: true })
    }

    try {
      const post = await getDashboardPostFn({ data: params.id })

      return { post }
    } catch (err) {
      if (isNotFound(err)) {
        throw notFound()
      }

      if (err && typeof err === 'object' && 'status' in err && err.status === 401) {
        throw redirect({ to: '/dashboard/posts', replace: true })
      }

      toast.add({
        type: 'error',
        description: 'Une erreur est survenue',
        priority: 'high',
      })
      throw redirect({ to: '/dashboard/posts' })
    }
  },
  loader: ({ context }) => ({ post: context.post }),
  head: () => ({ meta: pageMetadata("Modifier l'article") }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { post } = Route.useLoaderData()

  const sendNotificationMutation = useMutation({
    mutationFn: async () => {
      const result = await sendPostNotificationFn({ data: { postId: post.id } })

      if (!result.success) {
        return { error: true, message: result.error ?? '(( Une erreur est survenue ))' }
      }

      toast.success('(( Notification Discord envoyée ! ))')
      await router.invalidate()
      return { error: false }
    },
    onError: () => {
      return { error: true, message: '(( Une erreur est survenue ))' }
    },
  })

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

        {post.status === POST_STATUS.PUBLISHED && (
          <div className="flex">
            <ActionButton
              variant="outline"
              size="sm"
              areYouSureTitle={
                post.discordMessageId
                  ? '(( Envoyer une nouvelle notification ? ))'
                  : '(( Envoyer la notification Discord ? ))'
              }
              areYouSureDescription={
                post.discordMessageId
                  ? "L'ancien message sera supprimé et un nouveau sera envoyé."
                  : 'Une notification sera envoyée sur le salon approprié du Discord.'
              }
              requireAreYouSure
              action={() => sendNotificationMutation.mutateAsync()}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              {post.discordMessageId
                ? '(( Renvoyer la notification Discord ))'
                : '(( Envoyer la notification Discord ))'}
            </ActionButton>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <DashboardPostForm form={form} variant="edit" />
        </div>
      </div>
    </div>
  )
}
