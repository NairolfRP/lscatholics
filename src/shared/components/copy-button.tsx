import { CopyIcon } from 'lucide-react'
import { Button } from '#/shared/components/ui/button.tsx'
import { toast } from '#/shared/components/ui/toast'

type Props = {
  value: string
  label: string
}

export function CopyButton({ value, label }: Props) {
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copié dans le presse-papiers')
    } catch {
      toast.error(`Impossible de copier ${label}`)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={`Copier ${label}`}
      title={`Copier ${label}`}
      onClick={() => void copyToClipboard()}
    >
      <CopyIcon />
    </Button>
  )
}
