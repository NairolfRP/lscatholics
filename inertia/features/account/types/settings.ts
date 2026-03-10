import type { InertiaProps } from '@/types'

export type AccountSettingsPageProps = InertiaProps<{
  discordUser: { id: string; username: string; avatar: string } | null
}>
