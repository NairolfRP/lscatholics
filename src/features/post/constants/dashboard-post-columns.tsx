import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { EditIcon, Trash2Icon } from 'lucide-react'
import type { posts } from '#/server/db/schema/post-schema.ts'
import { ActionButton } from '#/shared/components/action-button.tsx'
import { Badge } from '#/shared/components/ui/badge.tsx'
import { ButtonGroup } from '#/shared/components/ui/button-group.tsx'
import { buttonVariants } from '#/shared/components/ui/button.tsx'
import { formatDate } from '#/utils/date.ts'
import type { DashboardPostsTableMeta } from '../types/dashboard-post.types'

const columnHelper = createColumnHelper<typeof posts.$inferSelect>()

export const dashboardPostColumns = [
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
      return (
        <ButtonGroup>
          {meta.canEditPost(info.row.original.authorId) && (
            <>
              <Link
                to="/dashboard/posts/edit/$id"
                params={{ id: info.row.original.id }}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                aria-label="Éditer l'article"
              >
                <EditIcon className="h-4 w-4" />
              </Link>
              <ActionButton
                variant="ghost"
                size="icon"
                areYouSureTitle="Êtes-vous sûr de vouloir supprimer cet article ?"
                title={`Supprimer « ${info.row.original.title} »`}
                aria-label={`Supprimer « ${info.row.original.title} »`}
                action={() => meta.onDelete(info.row.original.id)}
                requireAreYouSure
              >
                <Trash2Icon className="h-4 w-4 text-red-600" />
              </ActionButton>
            </>
          )}
        </ButtonGroup>
      )
    },
  }),
]
