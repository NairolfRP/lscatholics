import { CopyIcon } from 'lucide-react'
import { toast } from '#/shared/components/ui/toast'

type Props = {
  /**
   * The link to copy to clipboard (the production URL)
   */
  link: string
  /**
   * Optional custom message to display
   */
  message?: string
}

export function CefBlocker({ link, message }: Props) {
  const defaultMessage =
    'Cette application ne fonctionne plus via le navigateur FiveM.\n' +
    'Veuillez ouvrir le lien directement dans votre navigateur personnel :'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Lien copié dans le presse-papiers')
    } catch {
      toast.error('Impossible de copier le lien')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-black">
      <div className="w-full max-w-md space-y-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-200">
          <CopyIcon className="h-8 w-8 text-black" />
        </div>

        <h2 className="text-2xl font-bold text-cyan-700">{message || defaultMessage}</h2>

        <p className="text-sm text-black">
          Depuis la mise à jour du téléphone de GTA World, les apps hébergées sur Vercel (comme la
          nôtre) rencontrent des difficultés avec le navigateur intégré de FiveM. Vous êtes invité à
          ouvrir l'app via votre propre navigateur.
        </p>

        <p className="text-sm text-black">Cliquez sur l'encadré rouge pour copier l'URL.</p>

        <div
          onClick={copyLink}
          className="flex cursor-pointer items-center gap-5 rounded-md border border-red-500/20 bg-red-500/20 px-4 py-3 transition-colors select-none hover:bg-red-500/30"
          role="button"
          aria-label="Copier le lien vers le navigateur"
        >
          <CopyIcon className="text-black-300 ml-2 h-4 w-4" />
          <code className="font-mono text-sm text-black">{link}</code>
        </div>

        {/* Discord help message */}
        <p className="text-xs text-black/80">
          Si vous avez besoin d'aide à ce propos, rejoignez-nous sur le Discord de l'Archidiocèse de
          LS :{' '}
          <a
            href="https://discord.gg/CXVKwfP6cs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black underline"
          >
            https://discord.gg/CXVKwfP6cs
          </a>
        </p>
      </div>
    </div>
  )
}
