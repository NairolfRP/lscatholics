import type { AELFReading } from '@/features/readings/types/readings.types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { getReadingTypeLabel } from '@/shared/services/liturgy'
import { Typography } from '@/shared/components/ui/typography'

function ParsedInline({ text }: { text: string }): React.ReactNode[] {
  const parts = text.split(
    /(<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>|<br\s?\/?>|\*\*[\s\S]*?\*\*|_[\s\S]*?_|R\/)/
  )

  return parts.map((part, i) => {
    if (part === 'R/')
      return (
        <strong key={i} className="text-blue-600">
          R/{' '}
        </strong>
      )
    if (/^<strong>([\s\S]*?)<\/strong>$/.test(part)) {
      const inner = part.replace(/^<strong>|<\/strong>$/g, '')
      return (
        <strong key={i}>
          <ParsedInline text={inner} />
        </strong>
      )
    }
    if (/^<em>([\s\S]*?)<\/em>$/.test(part)) {
      const inner = part.replace(/^<em>|<\/em>$/g, '')
      return (
        <em key={i}>
          <ParsedInline text={inner} />
        </em>
      )
    }
    if (/^\*\*([\s\S]*?)\*\*$/.test(part)) {
      const inner = part.replace(/^\*\*|\*\*$/g, '')
      return (
        <strong key={i}>
          <ParsedInline text={inner} />
        </strong>
      )
    }
    if (/^_([\s\S]*?)_$/.test(part)) {
      const inner = part.replace(/^_|_$/g, '')
      return (
        <em key={i}>
          <ParsedInline text={inner} />
        </em>
      )
    }
    if (/<br\s?\/?>/.test(part)) return <br key={i} />
    return part
  })
}

function ParsedContent({ text }: { text: string }): React.ReactNode {
  if (!text) return null

  const cleaned = text.replace(/<p>/g, '\n').replace(/<\/p>/g, '\n').trim()
  const paragraphs = cleaned.split(/\n{2,}/).filter(Boolean)

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="mb-4">
          <ParsedInline text={paragraph.trim()} />
        </p>
      ))}
    </>
  )
}

export function ReadingCard({
  lecture,
  multiMass = false,
}: {
  lecture: AELFReading
  multiMass?: boolean
}) {
  return (
    <Card className="pt-0 shadow-md">
      <CardHeader className="bg-blue-50 px-6 py-4 border-b ">
        {getReadingTypeLabel(lecture.type) && (
          <CardTitle className="text-xl font-semibold mb-4 text-blue-800">
            {getReadingTypeLabel(lecture.type)}
          </CardTitle>
        )}
        <CardDescription>
          {lecture.titre && (
            <h4 className="text-base font-semibold italic text-blue-500">{lecture.titre}</h4>
          )}
          <p className={`text-blue-600 text-sm mt-1 ${!multiMass ? 'text-right' : ''}`}>
            {lecture.ref}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {!multiMass && lecture.refrain_psalmique && (
          <Typography className="mb-4">
            <strong>R/</strong>{' '}
            <ParsedInline text={lecture.refrain_psalmique.replace(/<\/?p>/g, '').trim()} />
          </Typography>
        )}
        {!multiMass && lecture.verset_evangile && (
          <div>
            <ParsedContent text={lecture.verset_evangile} />
          </div>
        )}
        <Typography>
          <ParsedContent text={lecture.contenu} />
        </Typography>
      </CardContent>
    </Card>
  )
}
