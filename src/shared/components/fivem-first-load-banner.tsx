import { useState, useSyncExternalStore } from 'react'
import { InfoIcon, XIcon } from 'lucide-react'
import { Alert, AlertAction, AlertDescription } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { isFiveMNui } from '#/utils/fivem-client.ts'

const subscribeToNothing = () => () => {}
const getVisibleOnClient = () => isFiveMNui
const getVisibleOnServer = () => false

export function FiveMFirstLoadBanner() {
  const isVisible = useSyncExternalStore(subscribeToNothing, getVisibleOnClient, getVisibleOnServer)
  const [isDismissed, setIsDismissed] = useState(false)

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-3xl">
      <Alert className="pr-14 shadow-lg">
        <InfoIcon aria-hidden="true" />
        <AlertDescription>
          (( Si vous rencontrez des soucis au premier chargement in-game de l'application, fermez et
          rouvrez l'app. Ces problèmes n'arrivent qu'au premier chargement. ))
        </AlertDescription>
        <AlertAction>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setIsDismissed(true)}
            aria-label="Fermer l'information"
          >
            <XIcon aria-hidden="true" />
          </Button>
        </AlertAction>
      </Alert>
    </div>
  )
}
