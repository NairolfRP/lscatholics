import { Card, CardDescription, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'

export function EmploymentApplicationDisclaimer() {
  return (
    <Card className="bg-muted py-5">
      <CardHeader>
        <CardTitle />
        <CardDescription className="leading-relaxed">
          L’Archidiocèse recrute, embauche et promeut son personnel sur la base du mérite, des
          compétences et des qualifications, sans discrimination fondée sur la race, la couleur de
          peau, l’origine nationale ou ethnique, l’ascendance, un handicap physique ou mental,
          l’état de santé, la situation matrimoniale, le sexe, l’âge, la grossesse ou le statut
          d’ancien combattant.
          <br />
          <br />
          L’Archidiocèse se réserve le droit d’être le seul juge du mérite, des compétences et des
          qualifications, et peut accorder une préférence aux candidats catholiques dans l’ensemble
          de ses décisions en matière d’emploi, en fonction de considérations religieuses et
          d’autres besoins, critères et politiques religieux.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
