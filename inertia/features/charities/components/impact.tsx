export function Impact() {
  return (
    <section className="bg-primary py-20 relative overflow-hidden">
      <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none select-none">
        <svg width="300" height="300" viewBox="0 0 100 100" fill="white">
          <rect x="40" y="5" width="20" height="90" />
          <rect x="5" y="30" width="90" height="20" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center">
          <p className="text-yellow-400 text-3xl sm:text-4xl md:text-5xl font-serif mb-2 font-medium">
            Au service des plus démunis, générateur d'espoir depuis plus de 100 ans.
          </p>
        </div>
      </div>
    </section>
  )
}
