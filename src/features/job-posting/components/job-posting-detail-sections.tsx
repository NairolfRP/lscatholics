import { CheckCircle2Icon, CircleArrowRightIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card'
import { Markdown } from '#shared/components/ui/markdown.tsx'

type JobPostingDetails = {
  description: string | null
  responsibilities: string[] | null
  requirements: string[] | null
  skills: string[] | null
}

export function JobPostingDetailSections({ job }: { job: JobPostingDetails }) {
  return (
    <>
      {job.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">À propos du poste</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral prose-headings:font-semibold prose-p:leading-relaxed">
            <Markdown content={job.description} />
          </CardContent>
        </Card>
      )}

      <JobPostingList
        title="Vos missions"
        items={job.responsibilities}
        Icon={CircleArrowRightIcon}
      />
      <JobPostingList title="Conditions requises" items={job.requirements} />
      <JobPostingList title="Profil recherché" items={job.skills} />
    </>
  )
}

function JobPostingList({
  title,
  items,
  Icon = CheckCircle2Icon,
}: {
  title: string
  items: string[] | null
  Icon?: typeof CheckCircle2Icon
}) {
  if (!items?.length) return null

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">{title}</h2>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <Icon className="mt-0.5 h-6 w-6 shrink-0 font-bold text-primary" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
