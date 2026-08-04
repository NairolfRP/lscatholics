import { useEffect, useState } from 'react'

export function useIsScrolled(threshold = 0): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      setIsScrolled(window.scrollY > threshold)
    }

    const handleScroll = () => {
      if (frame !== null) {
        return
      }
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame !== null) {
        cancelAnimationFrame(frame)
      }
    }
  }, [threshold])

  return isScrolled
}
