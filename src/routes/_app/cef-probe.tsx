import { useEffect, useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/cef-probe')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex',
      },
    ],
  }),
  component: RouteComponent,
})

type ProbeEntry = { id: string; label: string; value: string }

function RouteComponent() {
  const ringRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const [report, setReport] = useState('analyse en cours…')

  useEffect(() => {
    const cv = (el: Element, prop: string) => getComputedStyle(el).getPropertyValue(prop)
    const ring = ringRef.current
    const icon = iconRef.current
    const border = borderRef.current
    if (!ring || !icon || !border) return

    const entries: ProbeEntry[] = []

    const feature = (
      id: string,
      label: string,
      css: string,
      target: (root: HTMLElement) => Element
    ) => {
      const style = document.createElement('style')
      style.textContent = css
      document.head.appendChild(style)
      const root = document.createElement('div')
      root.hidden = true
      document.body.appendChild(root)
      const el = target(root)
      const value = cv(el, 'color')
      entries.push({ id, label, value: value === '' ? '(vide)' : value })
      root.remove()
      style.remove()
    }

    // @layer : si supporté, la règle dans @layer s'applique (pas de règle concurrente hors layer)
    feature(
      '@layer',
      '@layer probe{ .pl{ color: rgb(1, 2, 3) } } → @layer (le CSS charge la règle)',
      '@layer probe{ .pl{ color: rgb(1, 2, 3) } }',
      (root) => {
        const e = document.createElement('div')
        e.className = 'pl'
        root.appendChild(e)
        return e
      }
    )
    // :has() en contexte navigateur CEF
    feature(
      ':has()',
      'div:has(> span) → :has (le CSS charge la règle)',
      'div:has(> span){ color: rgb(4, 5, 6) }',
      (root) => {
        const e = document.createElement('div')
        e.innerHTML = '<span>x</span>'
        root.appendChild(e)
        return e
      }
    )
    // color-mix : couleur englobante résolue, sinon on retombe sur rgb(10,0,0)
    feature(
      'color-mix',
      'color-mix(in oklab, rgb(200 0 0), blue) (si rgb(10,0,0) → non supporté)',
      '.pm{ color: rgb(10, 0, 0); color: color-mix(in oklab, rgb(200 0 0), blue) }',
      (root) => {
        const e = document.createElement('div')
        e.className = 'pm'
        root.appendChild(e)
        return e
      }
    )
    // @property avec syntax:"*" + initial-value
    feature(
      '@property',
      '@property --pr{syntax:"*";inherits:false;initial-value:0 0 #0000} → (vide = non supporté)',
      '@property --pr{syntax:"*";inherits:false;initial-value:0 0 #0000}',
      (root) => {
        const e = document.createElement('div')
        root.appendChild(e)
        return e
      }
    )
    entries[entries.length - 1].value = (() => {
      const s = document.createElement('style')
      s.textContent = '@property --prx{syntax:"*";inherits:false;initial-value:0 0 #0000}'
      document.head.appendChild(s)
      const e = document.createElement('div')
      document.body.appendChild(e)
      const v = getComputedStyle(e).getPropertyValue('--prx')
      e.remove()
      s.remove()
      return v === '' ? '(vide)' : v
    })()

    const lines: string[] = []
    lines.push(`userAgent: ${navigator.userAgent}`)
    lines.push('')
    for (const { id, label, value } of entries) {
      lines.push(`${id}: ${value}`)
      lines.push(`   ${label}`)
    }
    lines.push('------------------')
    lines.push(`probe ring: box-shadow=${cv(ring, 'box-shadow')}`)
    lines.push(`probe ring: background-color=${cv(ring, 'background-color')}`)
    lines.push(`probe ring: --tw-ring-color=${cv(ring, '--tw-ring-color')}`)
    lines.push(`probe ring: --tw-ring-shadow=${cv(ring, '--tw-ring-shadow')}`)
    lines.push(`probe ring: --tw-shadow=${cv(ring, '--tw-shadow')}`)
    lines.push(`probe ring: transition-duration=${cv(ring, 'transition-duration')}`)
    lines.push(`probe icon: color=${cv(icon, 'color')}`)
    lines.push(`probe icon: background-color=${cv(icon, 'background-color')}`)
    lines.push('------------------')
    lines.push(`probe border: border-color=${cv(border, 'border-color')}`)
    lines.push(`probe border: box-shadow=${cv(border, 'box-shadow')}`)
    setReport(lines.join('\n'))
  }, [])

  return (
    <div className="container mx-auto space-y-6 px-4 py-10 font-mono text-xs">
      <h1 className="text-2xl font-bold">Diagnostic CEF</h1>
      <div className="flex flex-wrap gap-6">
        <div
          ref={ringRef}
          className="flex size-32 flex-col items-center justify-center gap-2 rounded-2xl bg-card p-4 text-center shadow-lg ring-1 ring-foreground/10 transition duration-300"
        >
          <span
            ref={iconRef}
            className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
          >
            R
          </span>
          <span className="text-sm font-semibold">ring+shadow</span>
        </div>
        <div
          ref={borderRef}
          className="flex size-32 items-center justify-center rounded-2xl border-2 border-primary/30 p-4 text-center text-sm font-semibold"
        >
          bordure réelle
        </div>
      </div>
      <pre className="overflow-x-auto rounded-xl bg-muted p-4">{report}</pre>
      <p className="max-w-2xl">
        Copie ce résultat (ou fais une capture) dans la conversation. Lecture :{' '}
        <code>@property</code> / <code>@layer</code> vide ou absent = moteur trop ancien → c'est la
        cause des liserés et ombres manquants ; <code>color-mix</code> non résolu = c'est notre «
        fivem-compat » qui doit compenser.
      </p>
    </div>
  )
}
