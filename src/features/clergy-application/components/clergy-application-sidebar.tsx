import { Link } from '@tanstack/react-router'
import { ClipboardCheckIcon, MessageCircleIcon } from 'lucide-react'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'

export function ClergyApplicationSidebar() {
  return (
    <>
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheckIcon className="size-5 text-amber-600 dark:text-amber-400" /> Un
            processus sérieux
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">(( OOC ))</strong> Rejoindre le clergé ne se fait
            pas « comme ça » : chaque candidature est examinée par l’Office des vocations. Nous
            vérifions les joueurs et leurs intentions pour éviter toute dérive et préserver le
            sérieux du RP religieux de la faction.
          </p>
          <p>
            Le formulaire vous est entièrement destiné, hors jeu. Rien de ce que vous y écrivez
            n’est joué par votre personnage.
          </p>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircleIcon className="size-5" /> Besoin d’aide&nbsp;?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            Avant de postuler, vous pouvez poser vos questions à l’Office des vocations. Aucune
            question n’est bête — et rien de ce que vous direz ne vous engage.
          </p>
          <Link to="/contact" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
            Contacter l’Office des vocations
          </Link>
        </CardContent>
      </Card>
    </>
  )
}
