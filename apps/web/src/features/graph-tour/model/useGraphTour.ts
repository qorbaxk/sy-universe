import { useCallback, useMemo, useState } from 'react'
import { tourSteps } from '@/entities/portfolio'

type UseGraphTourOptions = {
  onVisit: (nodeId: string) => void
}

export function useGraphTour({ onVisit }: UseGraphTourOptions) {
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)

  const step = useMemo(
    () => (active ? tourSteps[index] : null),
    [active, index],
  )

  const visit = useCallback(
    (nextIndex: number) => {
      const next = tourSteps[nextIndex]
      if (!next) return
      setIndex(nextIndex)
      onVisit(next.id)
    },
    [onVisit],
  )

  const start = useCallback(() => {
    setActive(true)
    visit(0)
  }, [visit])

  const stop = useCallback(() => {
    setActive(false)
    setIndex(0)
  }, [])

  const next = useCallback(() => {
    if (!active) return
    if (index >= tourSteps.length - 1) {
      setActive(false)
      return
    }
    visit(index + 1)
  }, [active, index, visit])

  const prev = useCallback(() => {
    if (!active || index <= 0) return
    visit(index - 1)
  }, [active, index, visit])

  return {
    active,
    index,
    step,
    total: tourSteps.length,
    start,
    stop,
    next,
    prev,
    isFirst: index === 0,
    isLast: index === tourSteps.length - 1,
  }
}
