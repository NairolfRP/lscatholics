import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { Typography } from '@/shared/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { DEPARTMENTS } from '@/shared/constants/departments.constants'

export default function DepartmentsPage() {
  const sorted = [...DEPARTMENTS].sort((a, b) => a.shortTitle.localeCompare(b.shortTitle))

  return (
    <>
      <Head title="Départements" />
      <section className="container max-w-4xl mx-auto my-40 space-y-10 px-5">
        <Typography variant="h1">Départements (ordre alphabétique)</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sorted.map((department) => (
            <Link
              key={`department-${department.id}`}
              route="departments.single"
              routeParams={{ slug: department.slug }}
            >
              <Card className="h-full bg-primary/10 card-hover cursor-pointer">
                <CardHeader>
                  <CardTitle className="font-bold text-xl">{department.shortTitle}</CardTitle>
                  <CardContent className="text-sm mt-4 p-0">{department.description}</CardContent>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
