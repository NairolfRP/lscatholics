import type { ComponentType, ReactNode } from 'react'
import { MapPinIcon, PhoneIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { socials } from '#shared/constants/socials.ts'
import { cn } from '#shared/lib/utils.ts'

export function ContactInfoPanel() {
  return (
    <aside className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Coordonnées</CardTitle>
          <CardDescription>
            Vous pouvez joindre la chancellerie via ces coordonnées.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 text-base">
          <InfoRow
            icon={PhoneIcon}
            iconClassName="bg-primary/10 text-primary"
            label="Téléphone (in-game)"
            value={<span className="text-lg leading-7 font-bold text-foreground">700</span>}
          />

          <InfoRow
            icon={MapPinIcon}
            iconClassName="bg-catholic-purple/10 text-catholic-purple"
            label="Adresse"
            value={
              <span className="font-medium">
                Tour de la Cathédrale Notre-Dame-des-Saints
                <br />
                <span className="text-muted-foreground">
                  Ginger street, Little Seoul
                  <br />
                  Los Santos, SA 90010, États-Unis
                </span>
              </span>
            }
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Suivez-nous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(socials)
              .filter(([_, social]) => !social.metadata?.isOOC && !social.metadata?.only)
              .map(([socialId, social]) => (
                <a
                  key={socialId}
                  href={social.href}
                  title={social.label}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full text-white transition-transform hover:scale-110',
                    social.className
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="size-5" />
                </a>
              ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

function InfoRow({
  icon: Icon,
  iconClassName,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  iconClassName?: string
  label: string
  value: ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          iconClassName
        )}
      >
        <Icon className="size-5" />
      </span>
      <div>
        <p className="text-xs font-bold tracking-wide text-secondary uppercase">{label}</p>
        <div className="mt-0.5 leading-relaxed">{value}</div>
      </div>
    </div>
  )
}
