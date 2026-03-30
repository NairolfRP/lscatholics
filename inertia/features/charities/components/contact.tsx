import { MapPin, Phone } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="bg-catholic-blue py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p
            className="text-catholic-gold text-sm uppercase tracking-[0.3em] mb-4"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Nous joindre
          </p>
          <h2
            className="text-white font-normal mb-6 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
            }}
          >
            Vous avez besoin d'aide ?
            <br />
            <em className="text-catholic-gold font-semibold">Nous sommes là.</em>
          </h2>
          <p
            className="text-white/80 text-sm leading-relaxed"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Nos bénévoles et travailleurs sociaux son prêts à intervenir. Aucune situation n'est
            trop petite ou trop complexe pour nous.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              icon: Phone,
              label: 'Téléphone',
              value: '700',
            },
            {
              icon: MapPin,
              label: 'Adresse',
              value: 'Refuge du Sacré-Coeur, Little Bighorn Avenue, Mission Row, Los Santos',
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 group">
              <div className="p-3 bg-catholic-gold/20 group-hover:bg-catholic-gold/40 transition-colors rounded-sm mt-0.5">
                <Icon className="h-4 w-4 text-catholic-gold" />
              </div>
              <div>
                <p
                  className="text-white/75 text-xs uppercase tracking-widest mb-1"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="text-white text-sm group-hover:text-catholic-gold transition-colors"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
