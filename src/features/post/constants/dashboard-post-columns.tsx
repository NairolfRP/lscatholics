import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { EditIcon, SendIcon, Trash2Icon } from 'lucide-react'
import { ActionButton } from '#/shared/components/action-button.tsx'
import { Badge } from '#/shared/components/ui/badge.tsx'
import { ButtonGroup } from '#/shared/components/ui/button-group.tsx'
import { buttonVariants } from '#/shared/components/ui/button.tsx'
import { formatDate } from '#/utils/date.ts'
import type { DashboardTableFeatures } from '#shared/lib/table-features.ts'
import { cn } from '#shared/lib/utils.ts'
import type { Post } from '#shared/types/post.types.ts'
import type { DashboardPostsTableMeta } from '../types/dashboard-post.types'

const columnHelper = createColumnHelper<DashboardTableFeatures, Post>()

export const dashboardPostColumns = columnHelper.columns([
  columnHelper.accessor('title', {
    header: () => 'Titre',
    cell: (info) => {
      const meta = info.table.options.meta as DashboardPostsTableMeta

      if (meta.canEditPost(info.row.original.authorId)) {
        return (
          <Link
            to="/dashboard/posts/show/$id"
            params={{ id: info.row.original.id }}
            className="hover:underline"
            disabled={!meta.canEditPost(info.row.original.authorId)}
          >
            {info.getValue()}
          </Link>
        )
      }

      return info.getValue()
    },
  }),
  columnHelper.accessor('status', {
    header: () => 'Statut',
    cell: (info) => {
      const status = info.getValue()
      return (
        <Badge
          variant={
            status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline'
          }
        >
          {status === 'published' ? 'Publié' : status === 'draft' ? 'Brouillon' : 'Archivé'}
        </Badge>
      )
    },
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Date',
    cell: (info) => {
      const createdAt = info.getValue()
      return formatDate(createdAt)
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const meta = info.table.options.meta as DashboardPostsTableMeta
      const post = info.row.original
      const isPublished = post.status === 'published'
      const hasNotification = post.discordMessageId != null

      const notifTitle = hasNotification
        ? '(( Renvoyer la notification Discord ))'
        : '(( Envoyer la notification Discord ))'

      return (
        <ButtonGroup>
          {meta.canUpdatePost(post.authorId) && (
            <Link
              to="/dashboard/posts/edit/$id"
              params={{ id: post.id }}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-label="Éditer l'article"
            >
              <EditIcon className="h-4 w-4" />
            </Link>
          )}
          {isPublished && meta.canUpdatePost(post.authorId) && (
            <ActionButton
              variant="ghost"
              size="icon"
              areYouSureTitle={
                hasNotification
                  ? '(( Envoyer une nouvelle notification ? ))'
                  : '(( Envoyer la notification Discord ? ))'
              }
              areYouSureDescription={
                hasNotification
                  ? "L'ancien message sera supprimé et un nouveau sera envoyé."
                  : 'Une notification sera envoyée sur le salon approprié du Discord.'
              }
              requireAreYouSure
              title={notifTitle}
              aria-label={notifTitle}
              action={() => meta.onSendNotification(post.id)}
            >
              <SendIcon className={cn('h-4 w-4', { 'text-warning': hasNotification })} />
            </ActionButton>
          )}
          {meta.canDeletePost(post.authorId) && (
            <ActionButton
              variant="ghost"
              size="icon"
              areYouSureTitle="Êtes-vous sûr de vouloir supprimer cet article ?"
              title={`Supprimer « ${post.title} »`}
              aria-label={`Supprimer « ${post.title} »`}
              action={() => meta.onDelete(post.id)}
              requireAreYouSure
            >
              <Trash2Icon className="h-4 w-4 text-red-600" />
            </ActionButton>
          )}
        </ButtonGroup>
      )
    },
  }),
])
