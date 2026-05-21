import { Badge } from '@/shared/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import type { Program } from '@/features/charities/types/charities'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Link } from '@adonisjs/inertia/react'

export function ProgramCard({ program }: { program: Program }) {
  const Icon = program.icon
  return (
    <Link route={program.route} routeParams={program.routeParams}>
      <Card className="group h-full border border-primary/20 hover:border-primary/40 transition-all duration-300 p-8 flex flex-col gap-4 cursor-pointer card-hover">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-secondary/10 group-hover:bg-primary/10 transition-colors duration-300 rounded-sm">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <Badge
            variant="outline"
            className="text-[10px] uppercase tracking-widest border-primary/40 text-primary"
          >
            {program.tag}
          </Badge>
        </div>
        <CardHeader className="p-0">
          <CardTitle
            className="text-xl group-hover:text-primary transition-colors duration-300"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            {program.title}
          </CardTitle>
          <CardDescription
            className="text-foreground/70 text-sm leading-relaxed"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {program.description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="p-0">
          <span
            className="text-primary text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all duration-200"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            En savoir plus <ArrowRight className="h-3 w-3" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
