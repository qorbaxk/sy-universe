import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)

    onChange()
    // DevTools 디바이스 전환까지 안정적으로 잡기 위해 둘 다 등록
    media.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)

    return () => {
      media.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [query])

  return matches
}
