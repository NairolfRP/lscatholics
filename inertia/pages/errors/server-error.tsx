import Head from '@/shared/components/app-head'

export default function ServerError() {
  return (
    <>
      <Head title="Une erreur est survenue" />

      <div className="my-60 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Erreur serveur</h1>
        <p className="text-xl opacity-90">Un problème est survenu. Veuillez réessayer plus tard.</p>
      </div>
    </>
  )
}
