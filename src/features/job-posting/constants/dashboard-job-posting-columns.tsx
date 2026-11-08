import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { EditIcon, LockIcon, Trash2Icon, UnlockIcon } from 'lucide-react'
import type {
  DashboardJobPostingsTableMeta,
  JobPosting,
} from '#/features/job-posting/types/job-posting.types.ts'
import { formatDate, formatDateTime } from '#/utils/date.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Badge } from '#shared/components/ui/badge.tsx'
import { ButtonGroup } from '#shared/components/ui/button-group.tsx'
import { Button, buttonVariants } from '#shared/components/ui/button.tsx'
import { employmentTypeLabel } from '#shared/constants/employment.ts'
import type { DashboardTableFeatures } from '#shared/lib/table-features.ts'
import { confirmAction } from '#shared/utils/confirm-action.ts'

const columnHelper = createColumnHelper<DashboardTableFeatures, JobPosting>()

export const dashboardJobPostingColumns = columnHelper.columns([
  columnHelper.accessor('isActive', {
    header: () => 'État',
    cell: (info) => {
      if (!info.getValue()) {
        return <Badge variant="destructive">Fermée</Badge>
      }

      return <Badge variant="success">Active</Badge>
    },
  }),
  columnHelper.accessor('title', {
    header: () => 'Titre',
    cell: (info) => {
      return (
        <Link
          to="/dashboard/job-openings/show/$id"
          params={{ id: info.row.original.id }}
          className="hover:underline"
        >
          {info.getValue()}
        </Link>
      )
    },
  }),
  columnHelper.accessor('employmentType', {
    header: () => 'Type',
    cell: (info) => {
      const employmentType = info.getValue()
      return employmentTypeLabel[employmentType]
    },
  }),
  columnHelper.accessor('department', {
    header: () => 'Département',
    cell: (info) => {
      const departmentId = info.getValue()
      const departmentLabel = getDepartmentTitle(departmentId, true)

      if (!departmentLabel) {
        return <em>Invalide ou obsolète</em>
      }

      return departmentLabel
    },
  }),
  columnHelper.accessor('postedAt', {
    header: () => 'Publiée le',
    cell: (info) => {
      const postedAt = info.getValue()

      if (!postedAt) {
        return <em>—</em>
      }

      return formatDate(postedAt)
    },
  }),
  columnHelper.accessor('expiresAt', {
    header: () => 'Expire le',
    cell: (info) => {
      const expiresAt = info.getValue()

      if (!expiresAt) {
        return <em>—</em>
      }

      return formatDateTime(expiresAt)
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const isActive = info.row.original.isActive
      const meta = info.table.options.meta as DashboardJobPostingsTableMeta
      return (
        <ButtonGroup>
          {meta.canUpdate ? (
            <Link
              to="/dashboard/job-openings/edit/$id"
              params={{ id: info.row.original.id }}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
              aria-label="Éditer l'article"
            >
              <EditIcon className="h-4 w-4" />
            </Link>
          ) : null}
          {meta.canUpdate ? (
            isActive ? (
              <Button
                variant="ghost"
                size="icon"
                title={`Clôre « ${info.row.original.title} »`}
                aria-label={`Clôre « ${info.row.original.title} »`}
                onClick={() =>
                  void confirmAction(
                    { title: "Êtes-vous sûr de vouloir fermer cette offre d'emploi ?" },
                    () => meta.onToggleActiveState(info.row.original.id)
                  )
                }
              >
                <LockIcon className="h-4 w-4 text-warning" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                title={`Rouvrir « ${info.row.original.title} »`}
                aria-label={`Rouvrir « ${info.row.original.title} »`}
                onClick={() =>
                  void confirmAction(
                    { title: "Êtes-vous sûr de vouloir rouvrir cette offre d'emploi ?" },
                    () => meta.onToggleActiveState(info.row.original.id)
                  )
                }
              >
                <UnlockIcon className="h-4 w-4 text-success" />
              </Button>
            )
          ) : null}
          {meta.canDelete ? (
            <Button
              variant="ghost"
              size="icon"
              title={`Supprimer « ${info.row.original.title} »`}
              aria-label={`Supprimer « ${info.row.original.title} »`}
              onClick={() =>
                void confirmAction(
                  { title: "Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?" },
                  () => meta.onDelete(info.row.original.id)
                )
              }
            >
              <Trash2Icon className="h-4 w-4 text-destructive" />
            </Button>
          ) : null}
        </ButtonGroup>
      )
    },
  }),
])
