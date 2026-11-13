import { SettingsIcon, ShieldCheckIcon } from 'lucide-react'

export const SETTINGS_TABS = [
  { to: '/account/settings', label: 'Général', icon: SettingsIcon },
  { to: '/account/sessions', label: 'Sessions', icon: ShieldCheckIcon },
] as const
