import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '#/shared/components/ui/badge.tsx'
import type { User } from '#/shared/lib/types/auth.ts'
import { formatDate } from '#/utils/date.ts'
import { parseCsvString } from '#/utils/string.ts'
import type { UsersTableMeta } from '../types/user.types'
import { UserActionsCell } from '../components/admin/users-actions-cell'

const columnHelper = createColumnHelper<User>()

export const userColumns = [
  columnHelper.accessor('name', {
    header: () => "Nom d'utilisateur GTAW",
    cell: (info) => (
      <Link
        to="/dashboard/users/edit/$id"
        params={{ id: info.row.original.id }}
        className="hover:underline"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('role', {
    header: () => 'Rôles',
    cell: (info) => {
      const rawRole = info.getValue()
      const roles = rawRole ? parseCsvString(rawRole) : []
      if (roles.length === 0) return null

      return (
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Badge key={role}>{role}</Badge>
          ))}
        </div>
      )
    },
    enableSorting: false,
  }),
  columnHelper.accessor('createdAt', {
    header: () => 'Créé le',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => {
      const meta = info.table.options.meta as UsersTableMeta
      return (
        <UserActionsCell
          target={info.row.original}
          currentUserId={meta.currentUserId}
          canDeleteUsers={meta.canDeleteUsers}
          onUnban={meta.onUnban}
          onBanSuccess={meta.onBanSuccess}
          onDelete={meta.onDelete}
        />
      )
    },
    enableSorting: false,
  }),
]
