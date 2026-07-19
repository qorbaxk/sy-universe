import type { GraphNode } from '@/entities/portfolio'

type Point3 = { x?: number; y?: number; z?: number; id?: string | number }
type Point2 = { x?: number; y?: number; id?: string | number }

type OrbitControlsLike = {
  autoRotate?: boolean
  autoRotateSpeed?: number
}

export function findNodeById<T extends { id?: string | number }>(
  nodes: T[],
  id: string,
) {
  return nodes.find((node) => String(node.id) === id)
}

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

export type FocusRequest = {
  nodeId: string
  nonce: number
}

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

/** 초기 배치가 끝나면 위치를 고정해 클릭/포커스 시 흔들림을 없앰 */
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

export function pinDraggedNode(node: GraphNodeWithCoords) {
  if (node.x == null || node.y == null) return
  node.fx = node.x
  node.fy = node.y
  if (node.z != null) node.fz = node.z
  node.vx = 0
  node.vy = 0
  node.vz = 0
}
