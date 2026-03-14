import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function DonateSidebar() {
  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              {' '}
              Informations fiscales{' '}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm">
              L'Archidiocèse de Los Santos est une organisation religieuse sans but lucratif. Vos
              dons sont déductibles d'impôts, conformément aux lois fédérales, étatiques et locales
              applicables.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900"> Votre impact </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">🏠</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Soutien communautaire</h4>
                <p className="text-sm text-gray-600">
                  Soutenir les familles et les personnes démunies
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 text-sm">⛪</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Patrimoine</h4>
                <p className="text-sm text-gray-600">
                  Restauration et conservation de monuments et du patrimoine religieux
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 text-sm">📚</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Éducation</h4>
                <p className="text-sm text-gray-600">
                  Financement des établissements d'enseignement et des programmes de formation
                  catholiques
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 text-sm">✝️</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Ministères paroissiaux</h4>
                <p className="text-sm text-gray-600">
                  Soutien à la mission de l'Église, à la liturgie, à la musique et aux programmes
                  spirituels
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
