import { useEffect, useRef, useState } from 'react'

/**
 * @alias 뷰포트 크기
 * @description 그래프 컨테이너의 width/height.
 */
export type GraphViewportSize = {
  /**
   * @alias 너비
   * @description 컨테이너 clientWidth.
   */
  width: number

  /**
   * @alias 높이
   * @description 컨테이너 clientHeight.
   */
  height: number
}

/**
 * @alias 그래프 뷰포트 훅
 * @description ResizeObserver로 컨테이너 크기를 추적한다. (불가피한 useEffect)
 */
export function useGraphViewport() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<GraphViewportSize>({ width: 0, height: 0 })

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const syncSize = () => {
      setSize({
        width: element.clientWidth,
        height: element.clientHeight,
      })
    }

    syncSize()
    const observer = new ResizeObserver(syncSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { containerRef, size, ready: size.width > 0 && size.height > 0 }
}
