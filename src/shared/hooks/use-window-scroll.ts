import React from 'react'

export function useWindowScroll(): [
  {
    x: number | null
    y: number | null
  },
  (args: number | object) => void,
] {
  const [state, setState] = React.useState<{ x: number | null; y: number | null }>({
    x: null,
    y: null,
  })

  const scrollTo = React.useCallback((x: number | ScrollToOptions, y?: number) => {
    if (typeof x === 'number' && typeof y === 'number') {
      window.scrollTo(x, y)
    } else if (typeof x === 'object') {
      window.scrollTo(x)
    } else {
      throw new Error(
        `Invalid arguments passed to scrollTo. See here for more info. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo`
      )
    }
  }, [])

  React.useLayoutEffect(() => {
    const handleScroll = () => {
      setState({ x: window.scrollX, y: window.scrollY })
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return [state, scrollTo]
}
