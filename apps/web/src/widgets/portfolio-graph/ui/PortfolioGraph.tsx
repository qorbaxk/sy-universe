import { useEffect, useRef, useState } from 'react'
import { WebGLEnableBanner } from '@/features/enable-webgl'
import { canUseWebGL } from '@/shared/lib/webgl/canUseWebGL'
import type { FocusRequest } from '../lib/focusNode'
import { PortfolioGraph2D } from './PortfolioGraph2D'
import { PortfolioGraph3D } from './PortfolioGraph3D'
import './PortfolioGraph.css'

type PortfolioGraphProps = {
  selectedId: string | null
  onSelect: (id: string | null) => void
  focusRequest: FocusRequest | null
  clearOnBackground?: boolean
  onReady?: () => void
}

export function PortfolioGraph({
  selectedId,
  onSelect,
  focusRequest,
  clearOnBackground = true,
  onReady,
}: PortfolioGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [mode, setMode] = useState<'checking' | '3d' | '2d'>('checking')

  useEffect(() => {
    setMode(canUseWebGL() ? '3d' : '2d')
  }, [])

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

  const ready = size.width > 0 && size.height > 0 && mode !== 'checking'

  return (
    <div ref={containerRef} className="portfolio-graph">
      {ready && mode === '3d' && (
        <PortfolioGraph3D
          width={size.width}
          height={size.height}
          onSelect={onSelect}
          onWebGLError={() => setMode('2d')}
          focusRequest={focusRequest}
          clearOnBackground={clearOnBackground}
          onReady={onReady}
        />
      )}

      {ready && mode === '2d' && (
        <PortfolioGraph2D
          width={size.width}
          height={size.height}
          selectedId={selectedId}
          onSelect={onSelect}
          focusRequest={focusRequest}
          clearOnBackground={clearOnBackground}
          onReady={onReady}
        />
      )}

      {mode === '2d' && <WebGLEnableBanner />}
    </div>
  )
}
