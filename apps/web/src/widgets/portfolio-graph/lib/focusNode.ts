import type { GraphNode } from '@/entities/portfolio'

type Point3 = { x?: number; y?: number; z?: number; id?: string | number }
type Point2 = { x?: number; y?: number; id?: string | number }

type OrbitControlsLike = {
  autoRotate?: boolean
  autoRotateSpeed?: number
}

/**
 * @alias ID로 노드 찾기
 * @description 좌표가 붙은 노드 배열에서 id로 검색한다.
 */
export function findNodeById<T extends { id?: string | number }>(
  nodes: T[],
  id: string,
) {
  return nodes.find((node) => String(node.id) === id)
}

/**
 * @alias 3D 노드 포커스
 * @description 카메라를 노드 근처로 부드럽게 이동한다.
 */
export function focusNode3D(
  graph: {
    cameraPosition: (
      position: { x: number; y: number; z: number },
      lookAt: { x: number; y: number; z: number },
      duration: number,
    ) => void
    controls?: () => OrbitControlsLike
  },
  node: Point3,
  duration = 1100,
) {
  if (node.x == null || node.y == null || node.z == null) return false

  const controls = graph.controls?.()
  const prevAutoRotate = controls?.autoRotate
  if (controls) controls.autoRotate = false

  const distance = 150
  const hyp = Math.hypot(node.x, node.y, node.z) || 1
  const distRatio = 1 + distance / hyp

  graph.cameraPosition(
    {
      x: node.x * distRatio,
      y: node.y * distRatio + 24,
      z: node.z * distRatio,
    },
    { x: node.x, y: node.y, z: node.z },
    duration,
  )

  window.setTimeout(() => {
    if (controls && prevAutoRotate != null) {
      controls.autoRotate = prevAutoRotate
    }
  }, duration + 40)

  return true
}

/**
 * @alias 2D 노드 포커스
 * @description 캔버스를 노드 중심으로 줌한다.
 */
export function focusNode2D(
  graph: {
    centerAt: (x: number, y: number, duration: number) => void
    zoom: (scale: number, duration: number) => void
  },
  node: Point2,
  duration = 900,
) {
  if (node.x == null || node.y == null) return false
  graph.centerAt(node.x, node.y, duration)
  graph.zoom(node.id === 'me' ? 2.35 : 2.05, duration)
  return true
}

/**
 * @alias 좌표 포함 그래프 노드
 * @description force-graph 시뮬레이션이 채우는 x/y/z 및 핀 필드.
 */
export type GraphNodeWithCoords = GraphNode & {
  x?: number
  y?: number
  z?: number
  vx?: number
  vy?: number
  vz?: number
  fx?: number
  fy?: number
  fz?: number
}

/**
 * @alias 전체 노드 핀
 * @description 초기 배치가 끝나면 위치를 고정해 클릭/포커스 시 흔들림을 없앤다.
 */
export function pinGraphNodes(nodes: GraphNodeWithCoords[]) {
  for (const node of nodes) {
    if (node.x == null || node.y == null) continue
    node.fx = node.x
    node.fy = node.y
    if (node.z != null) node.fz = node.z
    node.vx = 0
    node.vy = 0
    node.vz = 0
  }
}

/**
 * @alias 드래그 종료 핀
 * @description 사용자가 옮긴 노드를 그 자리에 고정한다.
 */
export function pinDraggedNode(node: GraphNodeWithCoords) {
  if (node.x == null || node.y == null) return
  node.fx = node.x
  node.fy = node.y
  if (node.z != null) node.fz = node.z
  node.vx = 0
  node.vy = 0
  node.vz = 0
}
