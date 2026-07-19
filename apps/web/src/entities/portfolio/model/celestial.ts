/**
 * @alias 천체 역할
 * @description 노드 비주얼에 매핑하는 태양계 천체 종류.
 */
export type CelestialRole =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'moon'

/**
 * @alias 천체 메타
 * @description 3D/2D 노드를 그릴 때 쓰는 색·크기·고리 등 비주얼 정보.
 */
export type CelestialBody = {
  /**
   * @alias 역할
   * @description sun/saturn 등 천체 역할.
   */
  role: CelestialRole

  /**
   * @alias 한글 라벨
   * @description 디버그/접근성용 천체 이름.
   */
  label: string

  /**
   * @alias 색상
   * @description 메인 행성 색 hex.
   */
  color: string

  /**
   * @alias 크기
   * @description 상대 반지름.
   */
  size: number

  /**
   * @alias 고리 여부
   * @description true면 고리를 그린다.
   */
  hasRing: boolean

  /**
   * @alias 고리 기울기
   * @description 라디안 단위 기울기.
   */
  ringTilt?: number

  /**
   * @alias 위성 여부
   * @description 위성 장식 여부(확장용).
   */
  hasMoon: boolean

  /**
   * @alias 텍스처 종류
   * @description Three 텍스처 생성 분기 키.
   */
  texture: 'sun' | 'gas' | 'rocky' | 'ice' | 'earth'
}

/**
 * @alias 노드별 천체 맵
 * @description 승연=태양, 셀핏=토성 등 고정 매핑. 새 노드는 fallback 사용.
 */
export const celestialByNodeId: Record<string, CelestialBody> = {
  me: {
    role: 'sun',
    label: '태양',
    color: '#ffb347',
    size: 17,
    hasRing: false,
    hasMoon: false,
    texture: 'sun',
  },
  career: {
    role: 'mercury',
    label: '수성',
    color: '#c2b29a',
    size: 7,
    hasRing: false,
    hasMoon: false,
    texture: 'rocky',
  },
  connectwave: {
    role: 'earth',
    label: '지구',
    color: '#3f8fdc',
    size: 9,
    hasRing: false,
    hasMoon: true,
    texture: 'earth',
  },
  nextinnovation: {
    role: 'mars',
    label: '화성',
    color: '#d16b4c',
    size: 8,
    hasRing: false,
    hasMoon: false,
    texture: 'rocky',
  },
  sellfit: {
    role: 'saturn',
    label: '토성',
    color: '#e6c27a',
    size: 12,
    hasRing: true,
    ringTilt: 0.45,
    hasMoon: true,
    texture: 'gas',
  },
  'samsung-hospital': {
    role: 'neptune',
    label: '해왕성',
    color: '#4d7cff',
    size: 10,
    hasRing: false,
    hasMoon: false,
    texture: 'ice',
  },
  'reason-market': {
    role: 'jupiter',
    label: '목성',
    color: '#d4a06a',
    size: 11,
    hasRing: false,
    hasMoon: true,
    texture: 'gas',
  },
  skills: {
    role: 'uranus',
    label: '천왕성',
    color: '#7ec8c8',
    size: 9,
    hasRing: true,
    ringTilt: 1.2,
    hasMoon: false,
    texture: 'ice',
  },
  contact: {
    role: 'moon',
    label: '달',
    color: '#cfd6df',
    size: 7,
    hasRing: false,
    hasMoon: false,
    texture: 'rocky',
  },
}

/**
 * @alias 천체 조회
 * @description 노드 ID에 대응하는 천체 메타. 없으면 소행성 fallback.
 */
export function getCelestialBody(nodeId: string): CelestialBody {
  return (
    celestialByNodeId[nodeId] ?? {
      role: 'mercury',
      label: '소행성',
      color: '#9aa8b5',
      size: 7,
      hasRing: false,
      hasMoon: false,
      texture: 'rocky',
    }
  )
}
