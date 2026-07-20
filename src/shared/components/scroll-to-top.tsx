import { useCallback, useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { useWindowScroll } from '#/shared/hooks/use-window-scroll'

const SCROLL_THRESHOLD = 200
const SCROLL_DURATION = 800

export default function ScrollToTopButton() {
  const [{ y }, scrollTo] = useWindowScroll()
  const [isScrolling, setIsScrolling] = useState(false)

  const isVisible = (y ?? 0) > SCROLL_THRESHOLD

  const scrollToTop = useCallback(async () => {
    if (isScrolling) {
      return
    }
    setIsScrolling(true)

    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      await new Promise<void>((resolve) => {
        if (prefersReducedMotion) {
          scrollTo({ top: 0 })
          resolve()
        } else {
          const startY = window.scrollY
          const startTime = performance.now()
          requestAnimationFrame((t) => animateScrollStep(startY, startTime, t, resolve))
        }
      })
    } catch {
      scrollTo({ top: 0 })
    } finally {
      setIsScrolling(false)
    }
  }, [isScrolling, scrollTo])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault()
        void scrollToTop()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [scrollToTop])

  return (
    <div
      className={[
        'fixed bottom-0 right-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pr-[calc(1.25rem+env(safe-area-inset-right))] z-50',
        'transition-all duration-300',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
      role="region"
      aria-label="Scroll to top"
    >
      <Button
        onClick={scrollToTop}
        disabled={isScrolling}
        className="shadow-lg transition-colors duration-200"
        variant="default"
        size="icon"
        aria-label="Scroll back to top of page"
        tabIndex={0}
      >
        <ChevronUp className="size-4" />
        <span className="sr-only">Back to top</span>
      </Button>
    </div>
  )
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateScrollStep(
  startY: number,
  startTime: number,
  currentTime: number,
  onDone: () => void
) {
  const elapsed = currentTime - startTime
  const progress = Math.min(elapsed / SCROLL_DURATION, 1)

  window.scrollTo(0, startY * (1 - progress > 1 ? 1 : easeOutCubic(progress)))

  if (progress < 1) {
    requestAnimationFrame((t) => animateScrollStep(startY, startTime, t, onDone))
  } else {
    onDone()
  }
}
