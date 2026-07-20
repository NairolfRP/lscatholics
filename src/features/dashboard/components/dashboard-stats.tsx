import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { cn } from '#/shared/lib/utils'
import { dashboardStatsAttributes } from '../constants/dashboard-stats'
import { dashboardStatsQueryOptions } from '../queries'

export function DashboardStats() {
  const { data } = useSuspenseQuery(dashboardStatsQueryOptions)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {dashboardStatsAttributes.map((item) => (
        <Card key={item.value}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            <item.icon className={cn('h-4 w-4', item.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data[item.value]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
