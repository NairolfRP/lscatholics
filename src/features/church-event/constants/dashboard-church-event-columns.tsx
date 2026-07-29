import { Link } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { CalendarIcon, EditIcon, Trash2Icon } from 'lucide-react'
import type { ChurchEvent } from '#/features/church-event/types/church-event.types.ts'
import type { DashboardChurchEventsTableMeta } from '#/features/church-event/types/dashboard-church-event.types.ts'
import { formatDateTime } from '#/utils/date.ts'
import { ActionButton } from '#shared/components/action-button.tsx'
import { ButtonGroup } from '#shared/components/ui/button-group.tsx'
import { buttonVariants } from '#shared/components/ui/button.tsx'

const columnHelper = createColumnHelper<ChurchEvent>()

export const dashboardChurchEventColumns = [
  columnHelper.accessor('title', {
    header: () => 'Événement',
    cell: (info) => {
      return (
        <Link
          to="/dashboard/events/show/$id"
          params={{ id: info.row.original.id }}
          className="hover:underline"
        >
          {info.getValue()}
        </Link>
      )
    },
  }),
  columnHelper.accessor('location', {
    header: () => 'Lieu',
    cell: (info) => {
      const location = info.getValue()

      if (!location) {
        return '—'
      }

      return location
    },
  }),
  columnHelper.accessor('startDate', {
    header: () => 'Date de début',
    cell: (info) => {
      const startDate = info.getValue()
      return (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {formatDateTime(startDate)}
        </div>
      )
    },
  }),
  columnHelper.accessor('endDate', {
    header: () => 'Date de fin',
    cell: (info) => {
      const endDate = info.getValue()

      if (!endDate) {
        return <span className="text-sm">—</span>
      }

      return (
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          {formatDateTime(endDate)}
        </div>
      )
    },
  }),
  columnHelper.accessor('maxParticipants', {
    header: () => 'Max participants',
    cell: (info) => {
      const maxParticipants = info.getValue()

      if (maxParticipants == null) {
        return <span className="text-sm">—</span>
      }

      return <span className="text-sm">{maxParticipants}</span>
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    cell: (info) => {
      const meta = info.table.options.meta as DashboardChurchEventsTableMeta
      return (
        <ButtonGroup>
          <Link
            to="/dashboard/events/edit/$id"
            params={{ id: info.row.original.id }}
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            aria-label="Éditer l'événement"
          >
            <EditIcon className="h-4 w-4" />
          </Link>
          <ActionButton
            variant="ghost"
            size="icon"
            areYouSureTitle="Êtes-vous sûr de vouloir supprimer cet événement ?"
            title={`Supprimer « ${info.row.original.title} »`}
            aria-label={`Supprimer « ${info.row.original.title} »`}
            action={() => meta.onDelete(info.row.original.id)}
            requireAreYouSure
          >
            <Trash2Icon className="h-4 w-4 text-red-600" />
          </ActionButton>
        </ButtonGroup>
      )
    },
  }),
] as unknown as ColumnDef<ChurchEvent, unknown>[]
