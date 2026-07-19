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

export type CelestialBody = {
  role: CelestialRole
  label: string
  color: string
  size: number
  hasRing: boolean
  ringTilt?: number
  hasMoon: boolean
  texture: 'sun' | 'gas' | 'rocky' | 'ice' | 'earth'
}

/** 승연=태양, 나머지는 태양계 행성 톤 */
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
