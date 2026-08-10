import { Image } from '@unpic/react'

export function DefaultNotFound() {
  return (
    <div className="container mx-auto my-48 flex max-w-7xl flex-col items-center px-4 text-center">
      <h1 className="mb-8 text-3xl font-bold md:text-5xl">Oops... Page non trouvée</h1>

      <Image
        src="/assets/images/404.webp"
        layout="constrained"
        width={800}
        height={450}
        alt="Saint Antoine avec une lanterne et des objets perdus"
        fetchPriority="high"
        className="rounded-xl shadow-lg"
      />

      <div className="mt-6 max-w-md rounded-lg border border-catholic-gold bg-card p-4">
        <p className="text-muted-foreground italic">
          <strong>Prions.</strong> Glorieux saint Antoine, tu as exercé le divin pouvoir de
          retrouver ce qui était perdu. Aide-moi à retrouver la grâce de Dieu, et rends-moi dévoué
          au service de Dieu et de la vertu. Fais-moi retrouver ce que j'ai perdu et montre-moi
          ainsi la présence de ta bonté.
        </p>
      </div>
    </div>
  )
}
