import { VOLUNTEER_IMPACT_STATS } from '#/features/volunteers/constants/volunteer-benefits.ts'

export function VolunteerBenefits() {
  return (
    <div className="mt-12 grid gap-6 rounded-2xl bg-muted/50 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
      {VOLUNTEER_IMPACT_STATS.map((stat) => (
        <div key={stat.value} className="flex flex-col items-center gap-2 text-center">
          <span className="bg-linear-135 from-[#f0c14b] via-[#e0a83e] to-[#b8860b] bg-clip-text text-4xl font-bold text-transparent tabular-nums sm:text-5xl">
            {stat.value}
          </span>
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
