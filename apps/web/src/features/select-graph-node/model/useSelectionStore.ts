import { create } from 'zustand'

/**
 * @alias 선택 스토어 상태
 * @description 현재 선택된 그래프 노드 ID와 액션.
 */
type SelectionState = {
  /**
   * @alias 선택 노드 ID
   * @description 디테일 패널에 열린 노드. null이면 닫힘.
   */
  selectedId: string | null

  /**
   * @alias 노드 선택
   * @description 주어진 ID로 선택 상태를 바꾼다.
   */
  selectNode: (id: string) => void

  /**
   * @alias 선택 해제
   * @description 패널을 닫기 위해 selectedId를 null로 만든다.
   */
  clearSelection: () => void
}

/**
 * @alias 그래프 선택 스토어
 * @description 전역으로 공유되는 노드 선택 상태(Zustand).
 */
export const useSelectionStore = create<SelectionState>((set) => ({
  selectedId: 'me',
  selectNode: (id) => set({ selectedId: id }),
  clearSelection: () => set({ selectedId: null }),
}))
