import { AlertCircleIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#/shared/components/ui/card'

export function DashboardRecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="flex items-center gap-2 text-sm text-muted-foreground italic">
          <AlertCircleIcon /> Fonctionnalité non implémentée
        </p>
      </CardContent>
    </Card>
  )
}
