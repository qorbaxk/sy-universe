import { create } from 'zustand'

/**
 * @alias 포커스 요청
 * @description 카메라 이동을 트리거하는 일회성 요청. nonce로 동일 노드 재포커스를 구분한다.
 */
export type FocusRequest = {
  /**
   * @alias 대상 노드 ID
   * @description 카메라가 향할 노드.
   */
  nodeId: string

  /**
   * @alias 요청 번호
   * @description 같은 nodeId라도 값이 바뀌면 새 포커스로 취급.
   */
  nonce: number
}

/**
 * @alias 포커스 스토어 상태
 * @description 그래프 카메라 포커스 요청과 액션.
 */
type FocusState = {
  /**
   * @alias 포커스 요청
   * @description 현재 대기 중인 포커스. 없으면 null.
   */
  focusRequest: FocusRequest | null

  /**
   * @alias 노드 포커스
   * @description nonce를 증가시키며 새 포커스 요청을 만든다.
   */
  focusNode: (nodeId: string) => void
}

/**
 * @alias 그래프 포커스 스토어
 * @description 카메라 이동 요청을 전역으로 관리한다.
 */
export const useFocusStore = create<FocusState>((set) => ({
  focusRequest: null,
  focusNode: (nodeId) =>
    set((state) => ({
      focusRequest: {
        nodeId,
        nonce: (state.focusRequest?.nonce ?? 0) + 1,
      },
    })),
}))
