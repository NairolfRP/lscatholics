import { usePageProps } from '@/shared/hooks/use_page_props'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'

export function ContactSuccessAlert() {
  const props = usePageProps<{ errors: { CONTACT_ERROR?: string } }>()

  if (!props.success && !props.errors?.CONTACT_ERROR) return

  return (
    <Alert
      variant={props.success ? 'success' : 'destructive'}
      role="alert"
      aria-live={props.success ? 'polite' : 'assertive'}
      className="mb-8"
    >
      {props.success ? <CheckCircle className="size-6" /> : <AlertTriangle className="size-6" />}
      <AlertTitle>{props.success ? 'Confirmation' : 'Erreur'}</AlertTitle>
      <AlertDescription>
        {props.success ? props.success : props.errors.CONTACT_ERROR}
      </AlertDescription>
    </Alert>
  )
}
