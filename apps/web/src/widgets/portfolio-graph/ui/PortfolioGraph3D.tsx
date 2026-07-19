import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph3D, {
  type ForceGraphMethods,
  type NodeObject,
} from 'react-force-graph-3d'
import type { FocusRequest } from '@/features/select-graph-node'
import type { GraphData, GraphNode } from '@/entities/portfolio'
import {
  createGraphNodeObject,
  pulseGraphNodeObject,
} from '@/shared/lib/three/createGraphNodeObject'
import {
  findNodeById,
  focusNode3D,
  pinDraggedNode,
  pinGraphNodes,
  type GraphNodeWithCoords,
} from '../lib/focusNode'

type GraphNodeObject = GraphNodeWithCoords & NodeObject

type PortfolioGraph3DProps = {
  /**
   * @alias 그래프 데이터
   * @description 스냅샷에서 파생된 nodes/links.
   */
  data: GraphData
  onSelect: (id: string | null) => void
  width: number
  height: number
  onWebGLError: () => void
  focusRequest: FocusRequest | null
  clearOnBackground?: boolean
  onReady?: () => void
}

/**
 * @alias 3D 포스 그래프
 * @description Three.js 기반 태양계형 포트폴리오 그래프 렌더러.
 */
export function PortfolioGraph3D({
  data,
  onSelect,
  width,
  height,
  onWebGLError,
  focusRequest,
  clearOnBackground = true,
  onReady,
}: PortfolioGraph3DProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNodeObject> | undefined>(
    undefined,
  )
  const failedRef = useRef(false)
  const pinnedRef = useRef(false)
  const readySentRef = useRef(false)
  const lastFocusNonce = useRef<number | null>(null)
  const [pinned, setPinned] = useState(false)

  const graphData = useMemo(
    () => ({
      nodes: data.nodes.map((node) => ({ ...node })) as GraphNodeWithCoords[],
      links: data.links.map((link) => ({
        source: link.source,
        target: link.target,
        highlight: link.highlight,
      })),
    }),
    [data],
  )

  const failSafe = useCallback(() => {
    if (failedRef.current) return
    failedRef.current = true
    onWebGLError()
  }, [onWebGLError])

  const settleAndReady = useCallback(() => {
    if (!pinnedRef.current) {
      pinGraphNodes(graphData.nodes)
      pinnedRef.current = true
      setPinned(true)
    }
    if (!readySentRef.current) {
      readySentRef.current = true
      // 핀 반영 후 포커스 요청이 들어가도록 다음 프레임에 ready 알림
      window.requestAnimationFrame(() => onReady?.())
    }
  }, [graphData.nodes, onReady])

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      if (
        typeof event.message === 'string' &&
        event.message.includes('WebGL')
      ) {
        failSafe()
      }
    }
    window.addEventListener('error', onError)
    return () => window.removeEventListener('error', onError)
  }, [failSafe])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const graph = graphRef.current
      if (!graph) {
        failSafe()
        return
      }

      try {
        const charge = graph.d3Force('charge') as
          | { strength?: (value: number) => void }
          | undefined
        charge?.strength?.(-320)

        const link = graph.d3Force('link') as
          | { distance?: (value: number) => void }
          | undefined
        link?.distance?.(110)

        const controls = graph.controls() as {
          autoRotate?: boolean
          autoRotateSpeed?: number
          enableDamping?: boolean
          dampingFactor?: number
        }
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.35
        controls.enableDamping = true
        controls.dampingFactor = 0.08
      } catch {
        failSafe()
      }
    }, 80)

    // 시뮬레이션이 안 끝나도 타임아웃으로 고정
    const settleTimer = window.setTimeout(settleAndReady, 1800)

    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(settleTimer)
    }
  }, [failSafe, settleAndReady])

  useEffect(() => {
    if (!focusRequest || !pinned) return
    if (lastFocusNonce.current === focusRequest.nonce) return

    lastFocusNonce.current = focusRequest.nonce

    const graph = graphRef.current
    const node = findNodeById(graphData.nodes, focusRequest.nodeId)
    if (graph && node) {
      focusNode3D(graph, node, 1100)
    }
  }, [focusRequest, pinned, graphData.nodes])

  try {
    return (
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ antialias: true, alpha: true }}
        showNavInfo={false}
        enableNodeDrag
        enableNavigationControls
        controlType="orbit"
        warmupTicks={60}
        cooldownTicks={120}
        cooldownTime={2500}
        d3AlphaDecay={0.04}
        d3VelocityDecay={0.35}
        linkColor={(link) =>
          (link as { highlight?: boolean }).highlight
            ? 'rgba(124, 219, 213, 0.75)'
            : 'rgba(154, 168, 181, 0.4)'
        }
        linkWidth={(link) =>
          (link as { highlight?: boolean }).highlight ? 1.6 : 0.9
        }
        linkOpacity={1}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.3}
        linkDirectionalParticleSpeed={0.004}
        nodeRelSize={6}
        nodeOpacity={0}
        nodeThreeObject={(node) => createGraphNodeObject(node as GraphNode)}
        nodeThreeObjectExtend={false}
        onNodeClick={(node) => onSelect(String(node.id))}
        onBackgroundClick={() => {
          if (clearOnBackground) onSelect(null)
        }}
        onEngineStop={settleAndReady}
        onEngineTick={() => {
          const graph = graphRef.current
          if (!graph) return
          const time = performance.now() / 1000
          graph.scene().traverse((object) => {
            if (object.userData?.glow) {
              pulseGraphNodeObject(object, time)
            }
          })
        }}
        onNodeDrag={(node) => {
          const current = node as GraphNodeWithCoords
          current.fx = undefined
          current.fy = undefined
          current.fz = undefined
        }}
        onNodeDragEnd={(node) => {
          pinDraggedNode(node as GraphNodeWithCoords)
        }}
      />
    )
  } catch {
    failSafe()
    return null
  }
}
