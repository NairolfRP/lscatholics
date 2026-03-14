import { PARISHIONER_BENEFITS } from '@/features/register-parishioner/constants/parishioner.constants'
import { Card, CardContent } from '@/shared/components/ui/card'

export function ParishionerBenefits() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {PARISHIONER_BENEFITS.map((benefit) => (
        <Card key={benefit.title}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <benefit.icon className={benefit.iconClass} />
              <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
