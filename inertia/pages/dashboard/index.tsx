import Head from '@/shared/components/app-head'

import { InertiaProps } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Calendar, FileText, Users } from 'lucide-react'

type PageProps = InertiaProps<{
  stats: {
    posts: number
    events: number
    users: number
  }
}>

const statsAttributes = [
  {
    label: 'Articles',
    value: 'posts' as const,
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    label: 'Événements',
    value: 'events' as const,
    icon: Calendar,
    color: 'text-green-600',
  },
  {
    label: 'Utilisateurs',
    value: 'users' as const,
    icon: Users,
    color: 'text-purple-600',
  },
]

export default function DashboardIndexPage({ stats }: PageProps) {
  return (
    <>
      <Head title="Tableau de bord" />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Bienvenue dans votre espace d'administration
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statsAttributes.map((stat) => (
            <Card key={stat.value}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="['h-4 w-4', stat.color]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats[stat.value]}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Aucune activité récente</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
