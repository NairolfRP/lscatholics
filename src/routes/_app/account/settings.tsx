import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { FileTextIcon, PaletteIcon, PlugIcon } from 'lucide-react'
import { UserConnections } from '#/features/user/components/user-connections'
import { UserDangerZone } from '#/features/user/components/user-danger-zone'
import { UserFormDrafts } from '#/features/user/components/user-form-drafts'
import { ThemeModeToggle } from '#/shared/components/theme-mode-toggle'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Separator } from '#/shared/components/ui/separator'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'

export const Route = createFileRoute('/_app/account/settings')({
  component: RouteComponent,
})

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-2">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4" />
      </div>
      <div className="space-y-0.5">
        <Typography variant="h3">{title}</Typography>
        <Typography variant="muted">{description}</Typography>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <section className="space-y-8">
      <div id="connexions">
        <SectionHeader
          icon={PlugIcon}
          title="Connexions"
          description="Liez ou déliez des comptes externes pour accéder à des fonctionnalités supplémentaires."
        />
        <div className="mt-3">
          <Suspense fallback={<Skeleton className="h-26 w-full rounded-md" />}>
            <UserConnections />
          </Suspense>
        </div>
      </div>

      <Separator />

      <div id="apparence">
        <SectionHeader
          icon={PaletteIcon}
          title="Apparence"
          description="Choisissez le thème de l'interface."
        />
        <div className="mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <PaletteIcon /> Thème
              </CardTitle>
              <CardDescription>Le thème est enregistré dans ce navigateur.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mode clair / sombre / système</span>
              <ThemeModeToggle />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <div id="brouillons">
        <SectionHeader
          icon={FileTextIcon}
          title="Brouillons de formulaires"
          description="Consultez et supprimez les brouillons enregistrés dans ce navigateur."
        />
        <div className="mt-3">
          <UserFormDrafts />
        </div>
      </div>

      <Separator />

      <div id="danger">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
          <UserDangerZone />
        </Suspense>
      </div>
    </section>
  )
}
