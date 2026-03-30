import { LogIn } from 'lucide-react'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { LinkText } from '@/shared/components/link-text'
import { urlFor } from '@/client'

type Props = {
  text?: string
}

export default function LoginAlert({ text }: Props) {
  return (
    <Alert variant="info">
      <LogIn />
      <AlertDescription>
        <span>
          Vous devez vous{' '}
          <LinkText href={urlFor('signIn')} className="text-info-foreground">
            connecter
          </LinkText>{' '}
          {text || 'pour utiliser cette fonctionnalité.'}
        </span>
      </AlertDescription>
    </Alert>
  )
}
