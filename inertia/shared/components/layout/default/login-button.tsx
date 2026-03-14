import { urlFor } from '@/client'
import { Button } from '@/shared/components/ui/button'
import { LogIn } from 'lucide-react'

export default function LoginButton() {
  return (
    <a href={urlFor('signIn')}>
      <Button
        variant="ghost"
        aria-label="Se connecter"
        className="uppercase text-sm lg:text-xs xl:text-base"
      >
        <LogIn className="size-6 lg:size-4 xl:size-5" />
        <span className="lg:hidden laptop:block">Connexion</span>
      </Button>
    </a>
  )
}
