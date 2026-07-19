import { create } from 'zustand'

/**
 * @alias 그래프 렌더 모드
 * @description WebGL 가능 시 3D, 아니면 2D 폴백.
 */
export type GraphRenderMode = '3d' | '2d'

/**
 * @alias 그래프 UI 스토어
 * @description WebGL 폴백·배너 등 그래프 주변 UI 플래그.
 */
type GraphUiState = {
  /**
   * @alias 렌더 모드
   * @description '3d' | '2d'.
   */
  mode: GraphRenderMode

  /**
   * @alias WebGL 안내 배너 열림
   * @description 하드웨어 가속 안내 모달/배너 표시 여부.
   */
  bannerOpen: boolean

  /**
   * @alias 2D로 전환
   * @description WebGL 실패 시 호출.
   */
  enable2DFallback: () => void

  /**
   * @alias 배너 열기
   * @description 하드웨어 가속 안내를 연다.
   */
  openBanner: () => void

  /**
   * @alias 배너 닫기
   * @description 하드웨어 가속 안내를 닫는다.
   */
  closeBanner: () => void
}

/**
 * @alias 그래프 UI 스토어
 * @description 렌더 모드와 WebGL 안내 배너 상태를 전역 관리한다.
 */
export const useGraphUiStore = create<GraphUiState>((set) => ({
  mode: '3d',
  bannerOpen: false,
  enable2DFallback: () => set({ mode: '2d', bannerOpen: true }),
  openBanner: () => set({ bannerOpen: true }),
  closeBanner: () => set({ bannerOpen: false }),
}))
