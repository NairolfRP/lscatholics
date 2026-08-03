import { useState } from 'react'
import { CheckIcon } from 'lucide-react'
import { cn } from '#/shared/lib/utils'

export interface VocationsSelfTestResult {
  min: number
  title: string
  message: string
}

interface VocationsSelfTestProps {
  signs: string[]
  results: VocationsSelfTestResult[]
}

export function VocationsSelfTest({ signs, results }: VocationsSelfTestProps) {
  const [checked, setChecked] = useState<boolean[]>(() => signs.map(() => false))

  const count = checked.filter(Boolean).length
  const result = [...results].reverse().find((entry) => count >= entry.min)

  const toggle = (index: number) =>
    setChecked((prev) => prev.map((value, i) => (i === index ? !value : value)))

  return (
    <div className="mx-auto max-w-3xl">
      <ul className="space-y-3">
        {signs.map((sign, index) => {
          const isChecked = checked[index]
          return (
            <li key={sign}>
              <button
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggle(index)}
                className={cn(
                  'flex w-full items-start gap-4 rounded-xl border p-5 text-left transition',
                  isChecked
                    ? 'border-amber-400/60 bg-amber-400/10'
                    : 'border-white/10 bg-white/5 hover:border-white/25'
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition',
                    isChecked
                      ? 'border-amber-400 bg-amber-400 text-zinc-950'
                      : 'border-white/30 text-transparent'
                  )}
                >
                  <CheckIcon className="size-4" />
                </span>
                <span
                  className={cn(
                    'text-base leading-relaxed',
                    isChecked ? 'text-white' : 'text-white/85'
                  )}
                >
                  {sign}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 rounded-2xl border border-amber-400/30 bg-linear-to-b from-amber-400/10 to-transparent p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Votre résultat · {count} signe{count > 1 ? 's' : ''} coché{count > 1 ? 's' : ''}
        </p>
        <p className="mt-3 text-2xl font-bold text-white">{result?.title}</p>
        <p className="mt-2 leading-relaxed text-white/75">{result?.message}</p>
      </div>
    </div>
  )
}
