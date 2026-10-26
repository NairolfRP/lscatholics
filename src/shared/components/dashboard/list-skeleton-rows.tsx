import { Skeleton } from '#/shared/components/ui/skeleton.tsx'
import {
  Table as TableShadcn,
  TableBody,
  TableCell,
  TableRow,
} from '#/shared/components/ui/table.tsx'

type DashboardListSkeletonCell = {
  widths: string[]
  className?: string
  contentClassName?: string
}

export function DashboardListSkeletonRows({ rows }: { rows: DashboardListSkeletonCell[][] }) {
  return (
    <div>
      <TableShadcn>
        <TableBody>
          {rows.map((cells, index) => (
            <TableRow key={index} className="hover:bg-transparent">
              {cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={`bg-background ${cell.className ?? ''}`}>
                  <div className={cell.contentClassName ?? 'flex flex-wrap gap-2'}>
                    {cell.widths.map((width, widthIndex) => (
                      <Skeleton key={widthIndex} className={width} />
                    ))}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableShadcn>
    </div>
  )
}
