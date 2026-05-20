import type { InertiaProps } from '@/shared/types/pages'

export type AccountSettingsPageProps = InertiaProps<{
  discordUser: { id: string; username: string; avatar: string } | null
}>
