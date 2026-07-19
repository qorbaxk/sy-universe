import { create } from 'zustand'
import { tourSteps } from '@/entities/portfolio'

/**
 * @alias 투어 스토어 상태
 * @description 가이드 투어 진행 상태와 네비게이션 액션.
 */
type TourState = {
  /**
   * @alias 활성 여부
   * @description true면 투어 UI가 열린 상태.
   */
  active: boolean

  /**
   * @alias 현재 인덱스
   * @description tourSteps 배열에서의 위치.
   */
  index: number

  /**
   * @alias 투어 시작
   * @description 첫 스텝부터 투어를 시작한다. onVisit으로 노드 포커스를 알린다.
   */
  start: (onVisit: (nodeId: string) => void) => void

  /**
   * @alias 투어 종료
   * @description 투어를 끄고 인덱스를 초기화한다.
   */
  stop: () => void

  /**
   * @alias 이전 스텝
   * @description 한 단계 뒤로 이동하며 onVisit을 호출한다.
   */
  prev: (onVisit: (nodeId: string) => void) => void

  /**
   * @alias 다음 스텝
   * @description 한 단계 앞으로 이동하며 onVisit을 호출한다.
   */
  next: (onVisit: (nodeId: string) => void) => void
}

/**
 * @alias 가이드 투어 스토어
 * @description 투어 활성/인덱스를 Zustand로 관리한다.
 */
export const useTourStore = create<TourState>((set, get) => ({
  active: false,
  index: 0,

  start: (onVisit) => {
    set({ active: true, index: 0 })
    onVisit(tourSteps[0].id)
  },

  stop: () => set({ active: false, index: 0 }),

  prev: (onVisit) => {
    const { index, active } = get()
    if (!active || index <= 0) return
    const nextIndex = index - 1
    set({ index: nextIndex })
    onVisit(tourSteps[nextIndex].id)
  },

  next: (onVisit) => {
    const { index, active } = get()
    if (!active || index >= tourSteps.length - 1) return
    const nextIndex = index + 1
    set({ index: nextIndex })
    onVisit(tourSteps[nextIndex].id)
  },
}))

/**
 * @alias 투어 스텝 총 개수
 * @description UI 표시용 상수. 매 렌더마다 새로 만들지 않는다.
 */
export const TOUR_TOTAL = tourSteps.length
