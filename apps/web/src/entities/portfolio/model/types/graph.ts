/**
 * @alias 노드 종류
 * @description 그래프에서 노드가 나타내는 도메인 역할.
 */
export type NodeKind =
  | 'me'
  | 'career'
  | 'company'
  | 'project'
  | 'skills'
  | 'contact'

/**
 * @alias 그래프 노드
 * @description 3D/2D 포스 그래프에 그릴 단일 노드.
 */
export interface GraphNode {
  /**
   * @alias 노드 ID
   * @description 선택·포커스·상세 조회에 쓰는 고유 ID.
   */
  id: string

  /**
   * @alias 노드 종류
   * @description me/career/company/project 등 역할.
   */
  kind: NodeKind

  /**
   * @alias 라벨
   * @description 노드 옆에 표시할 이름.
   */
  label: string

  /**
   * @alias 부제
   * @description 기간·회사명 등 보조 텍스트.
   */
  subtitle?: string

  /**
   * @alias 피처드
   * @description 강조 프로젝트 여부.
   */
  featured?: boolean

  /**
   * @alias 상대 크기
   * @description force-graph `val`에 넘길 상대 가중치(선택).
   */
  val?: number
}

/**
 * @alias 그래프 링크
 * @description 두 노드를 잇는 간선.
 */
export interface GraphLink {
  /**
   * @alias 출발 노드 ID
   * @description 링크의 source 노드.
   */
  source: string

  /**
   * @alias 도착 노드 ID
   * @description 링크의 target 노드.
   */
  target: string

  /**
   * @alias 하이라이트
   * @description true면 강조 색/두께로 그린다.
   */
  highlight?: boolean
}

/**
 * @alias 그래프 데이터
 * @description force-graph에 넘길 nodes + links 묶음.
 */
export interface GraphData {
  /**
   * @alias 노드 목록
   * @description 화면에 그릴 모든 노드.
   */
  nodes: GraphNode[]

  /**
   * @alias 링크 목록
   * @description 노드 간 연결.
   */
  links: GraphLink[]
}
