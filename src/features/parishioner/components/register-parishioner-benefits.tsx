import { PARISHIONER_BENEFITS } from '#/features/parishioner/constants/parishioner-benefits.ts'
import { Card, CardContent, CardDescription, CardTitle } from '#shared/components/ui/card.tsx'

export function RegisterParishionerBenefits() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {PARISHIONER_BENEFITS.map((benefit) => (
        <Card key={benefit.title}>
          <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <benefit.icon className="size-6" />
            </span>
            <CardTitle>{benefit.title}</CardTitle>
            <CardDescription className="max-w-56">{benefit.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
