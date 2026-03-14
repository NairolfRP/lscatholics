import { cn } from '@/lib/utils'
import { ComponentProps, useCallback, useRef } from 'react'
import { Textarea } from '@/shared/components/ui/textarea'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import {
  Bold,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Quote,
} from 'lucide-react'

type MarkdownTextareaProps = Omit<ComponentProps<typeof Textarea>, 'onChange'> & {
  onChange?: (value: string) => void
}

type ToolbarAction = {
  icon: React.ReactNode
  label: string
  action: (textarea: HTMLTextAreaElement, onChange?: (value: string) => void) => void
}

function applyChange(
  textarea: HTMLTextAreaElement,
  newValue: string,
  cursorStart: number,
  cursorEnd: number,
  onChange?: (value: string) => void
) {
  onChange?.(newValue)
  requestAnimationFrame(() => {
    textarea.setSelectionRange(cursorStart, cursorEnd)
    textarea.focus()
  })
}

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  placeholder: string,
  onChange?: (value: string) => void
) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = textarea.value.substring(start, end) || placeholder
  const newValue =
    textarea.value.substring(0, start) + before + selected + after + textarea.value.substring(end)
  const newCursor = start + before.length + selected.length + after.length
  applyChange(textarea, newValue, newCursor, newCursor, onChange)
}

function prependLine(
  textarea: HTMLTextAreaElement,
  prefix: string,
  placeholder: string,
  onChange?: (value: string) => void
) {
  const start = textarea.selectionStart
  const lineStart = textarea.value.lastIndexOf('\n', start - 1) + 1
  const hasPrefix = textarea.value.substring(lineStart).startsWith(prefix)

  if (hasPrefix) {
    const newValue =
      textarea.value.substring(0, lineStart) + textarea.value.substring(lineStart + prefix.length)
    const newCursor = Math.max(lineStart, start - prefix.length)
    applyChange(textarea, newValue, newCursor, newCursor, onChange)
  } else {
    const selected =
      textarea.value.substring(textarea.selectionStart, textarea.selectionEnd) || placeholder
    const newValue =
      textarea.value.substring(0, lineStart) +
      prefix +
      selected +
      textarea.value.substring(textarea.selectionEnd)
    const newCursor = lineStart + prefix.length + selected.length
    applyChange(textarea, newValue, newCursor, newCursor, onChange)
  }
}

function insertLink(textarea: HTMLTextAreaElement, onChange?: (value: string) => void) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = textarea.value.substring(start, end) || 'texte du lien'
  const insertion = `[${selected}](url)`
  const newValue = textarea.value.substring(0, start) + insertion + textarea.value.substring(end)
  const urlStart = start + selected.length + 3
  applyChange(textarea, newValue, urlStart, urlStart + 3, onChange)
}

function insertImage(textarea: HTMLTextAreaElement, onChange?: (value: string) => void) {
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = textarea.value.substring(start, end) || 'description'
  const insertion = `![${selected}](url)`
  const newValue = textarea.value.substring(0, start) + insertion + textarea.value.substring(end)
  const urlStart = start + selected.length + 4
  applyChange(textarea, newValue, urlStart, urlStart + 3, onChange)
}

function insertHorizontalRule(textarea: HTMLTextAreaElement, onChange?: (value: string) => void) {
  const start = textarea.selectionStart
  const insertion = '\n---\n'
  const newValue = textarea.value.substring(0, start) + insertion + textarea.value.substring(start)
  const newCursor = start + insertion.length
  applyChange(textarea, newValue, newCursor, newCursor, onChange)
}

export function MarkdownTextarea({
  id,
  value = '',
  onChange,
  placeholder = 'Écrivez votre contenu en Markdown...',
  disabled = false,
  className,
  rows = 5,
  ...props
}: MarkdownTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAction = useCallback(
    (action: (ta: HTMLTextAreaElement, cb?: (v: string) => void) => void) => {
      if (textareaRef.current) action(textareaRef.current, onChange)
    },
    [onChange]
  )

  const toolbarGroups: ToolbarAction[][] = [
    [
      {
        icon: <Bold className="size-3.5" />,
        label: 'Gras',
        action: (ta, cb) => wrapSelection(ta, '**', '**', 'texte en gras', cb),
      },
      {
        icon: <Italic className="size-3.5" />,
        label: 'Italique',
        action: (ta, cb) => wrapSelection(ta, '_', '_', 'texte en italique', cb),
      },
    ],
    [
      {
        icon: <Heading2 className="size-3.5" />,
        label: 'Titre 2',
        action: (ta, cb) => prependLine(ta, '## ', 'Titre', cb),
      },
      {
        icon: <Heading3 className="size-3.5" />,
        label: 'Titre 3',
        action: (ta, cb) => prependLine(ta, '### ', 'Titre', cb),
      },
      {
        icon: <Quote className="size-3.5" />,
        label: 'Citation',
        action: (ta, cb) => prependLine(ta, '> ', 'Citation', cb),
      },
    ],
    [
      {
        icon: <List className="size-3.5" />,
        label: 'Liste',
        action: (ta, cb) => prependLine(ta, '- ', 'Élément', cb),
      },
      {
        icon: <ListOrdered className="size-3.5" />,
        label: 'Liste numérotée',
        action: (ta, cb) => prependLine(ta, '1. ', 'Élément', cb),
      },
    ],
    [
      {
        icon: <Link className="size-3.5" />,
        label: 'Lien',
        action: insertLink,
      },
      {
        icon: <Image className="size-3.5" />,
        label: 'Image',
        action: insertImage,
      },
      {
        icon: <Minus className="size-3.5" />,
        label: 'Séparateur',
        action: insertHorizontalRule,
      },
    ],
  ]

  return (
    <div className={cn('rounded-md border bg-background', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        {toolbarGroups.map((group, i) => (
          <div key={i} className="flex items-center gap-0.5">
            {i > 0 && <Separator orientation="vertical" className="mx-1 h-4" />}
            {group.map((tool) => (
              <Button
                key={tool.label}
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                title={tool.label}
                disabled={disabled}
                onClick={() => handleAction(tool.action)}
              >
                {tool.icon}
                <span className="sr-only">{tool.label}</span>
              </Button>
            ))}
          </div>
        ))}
      </div>

      <Textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight: `${rows * 24}px` }}
        className="rounded-t-none border-0 font-mono text-sm shadow-none focus-visible:ring-0 resize-y"
        {...props}
      />
    </div>
  )
}
