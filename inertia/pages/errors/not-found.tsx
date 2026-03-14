import Head from '@/shared/components/app-head'

export default function ServerError() {
  return (
    <>
      <Head title="Page introuvable" />

      <div className="my-60 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Page introuvable</h1>
        <p className="text-xl opacity-90">Cette page n'existe pas ou plus.</p>
      </div>
    </>
  )
}
