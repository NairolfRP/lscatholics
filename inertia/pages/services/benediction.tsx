import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/service-layout'

export default function BenedictionPage() {
  return (
    <ServiceLayout serviceId="benediction">
      <Typography>
        Pour fortifier la foi des croyants et faire obstacle aux mauvais esprits, l'Église bénit les
        maisons, les lieux de travail, les commerces, les outils de travail, les véhicules et tout
        ce qui entoure les lieux, les instruments ou les objets qui entourent les activités
        humaines.
      </Typography>
      <Typography variant="blockquote">
        Béni soit Dieu, le Père de notre Seigneur Jésus Christ ! Il nous a bénis et comblés des
        bénédictions de l'Esprit, au ciel, dans le Christ. (Éphésiens 1:3)
      </Typography>
      <Typography variant="blockquote">
        Dans toute maison où vous entrerez, dites d'abord : "Paix à cette maison" (Luc 10:5)
      </Typography>
      <Typography variant="h2" className="mt-10">
        Conditions pour les bénédictions
      </Typography>
      <Typography variant="list">
        <li>
          Non obligatoire, mais il est recommandé d'être baptisé ou en parcours vers le baptême
        </li>
        <li>Avoir une autorité sur le lieu ou l'objet béni (ex. : le propriétaire)</li>
        <li>Ne pas être excommunié ou empêché par le droit de l'Église</li>
      </Typography>
      <Typography variant="h2" className="mt-10">
        Demander des bénédictions
      </Typography>
      <Typography>
        Contactez l'archidiocèse pour fixer une date avec un prêtre ou un diacre.
      </Typography>
    </ServiceLayout>
  )
}
