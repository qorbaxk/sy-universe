import { useEffect } from 'react'
import type { GraphData } from '@/entities/portfolio'
import {
  useGraphUiStore,
  WebGLEnableBanner,
  type GraphRenderMode,
} from '@/features/enable-webgl'
import type { FocusRequest } from '@/features/select-graph-node'
import { canUseWebGL } from '@/shared/lib/webgl/canUseWebGL'
import { useGraphViewport } from '../hooks/useGraphViewport'
import { PortfolioGraph2D } from './PortfolioGraph2D'
import { PortfolioGraph3D } from './PortfolioGraph3D'

type PortfolioGraphProps = {
  /**
   * @alias 그래프 데이터
   * @description React Query로 받은 파생 그래프.
   */
  data: GraphData

  /**
   * @alias 선택 ID
   * @description 현재 선택된 노드.
   */
  selectedId: string | null

  /**
   * @alias 선택 핸들러
   * @description 노드 클릭/배경 클릭 시 호출.
   */
  onSelect: (id: string | null) => void

  /**
   * @alias 포커스 요청
   * @description 카메라 이동 트리거.
   */
  focusRequest: FocusRequest | null

  /**
   * @alias 배경 클릭 시 선택 해제
   * @description 투어 중에는 false로 둔다.
   */
  clearOnBackground?: boolean

  /**
   * @alias 준비 완료 콜백
   * @description 시뮬레이션 settle 후 최초 1회.
   */
  onReady?: () => void
}

/**
 * @alias 포트폴리오 그래프 셸
 * @description 뷰포트·WebGL 판별 후 3D/2D 렌더러를 고른다.
 */
export function PortfolioGraph({
  data,
  selectedId,
  onSelect,
  focusRequest,
  clearOnBackground = true,
  onReady,
}: PortfolioGraphProps) {
  const { containerRef, size, ready } = useGraphViewport()
  const mode = useGraphUiStore((s) => s.mode)
  const enable2DFallback = useGraphUiStore((s) => s.enable2DFallback)

  useEffect(() => {
    if (!canUseWebGL()) {
      enable2DFallback()
    }
  }, [enable2DFallback])

  const renderMode: GraphRenderMode = mode

  return (
    <div ref={containerRef} className="relative h-full w-full min-h-0">
      {ready && renderMode === '3d' && (
        <PortfolioGraph3D
          data={data}
          width={size.width}
          height={size.height}
          onSelect={onSelect}
          onWebGLError={enable2DFallback}
          focusRequest={focusRequest}
          clearOnBackground={clearOnBackground}
          onReady={onReady}
        />
      )}

      {ready && renderMode === '2d' && (
        <PortfolioGraph2D
          data={data}
          width={size.width}
          height={size.height}
          selectedId={selectedId}
          onSelect={onSelect}
          focusRequest={focusRequest}
          clearOnBackground={clearOnBackground}
          onReady={onReady}
        />
      )}

      {renderMode === '2d' && <WebGLEnableBanner />}
    </div>
  )
}
