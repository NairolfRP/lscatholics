import { Image } from '@unpic/react'

export function DefaultNotFound() {
  return (
    <div className="mx-auto max-w-7xl container my-48 text-center px-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold mb-8">
        Oops... Page non trouvée
      </h1>

      <Image
        src="/assets/images/404.webp"
        layout="constrained"
        width={800}
        height={450}
        alt="Saint Antoine avec une lanterne et des objets perdus"
        fetchPriority="high"
        className="rounded-xl shadow-lg"
      />

      <div className="mt-6 bg-card p-4 rounded-lg border border-catholic-gold max-w-md">
        <p className="italic text-muted-foreground">
          <strong>Prions.</strong> Glorieux saint Antoine, tu as exercé le divin pouvoir de retrouver ce qui était perdu. Aide-moi à retrouver la grâce de Dieu, et rends-moi dévoué au service de Dieu et de la vertu. Fais-moi retrouver ce que j'ai perdu et montre-moi ainsi la présence de ta bonté.
        </p>
      </div>
    </div>
  )
}
