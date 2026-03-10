import Head from '@/shared/components/app-head'
import { Typography } from '@/shared/components/ui/typography'
import { DiscordConnection } from '@/features/account/components/discord-connection'
import { AccountSettingsPageProps } from '@/features/account/types/settings'
import { DangerZone } from '@/features/account/components/danger-zone'

export default function AccountPage({ user }: AccountSettingsPageProps) {
  return (
    <>
      <Head title={user!.name} />
      <section className="container max-w-4xl mx-auto my-40 space-y-10 px-5">
        <Typography variant="h1">Mes paramètres</Typography>

        <DiscordConnection />

        <DangerZone />
      </section>
    </>
  )
}
