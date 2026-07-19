import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D, {
  type ForceGraphMethods,
  type NodeObject,
} from 'react-force-graph-2d'
import { getCelestialBody, type GraphData } from '@/entities/portfolio'
import type { FocusRequest } from '@/features/select-graph-node'
import { theme } from '@/shared/config/theme'
import {
  findNodeById,
  focusNode2D,
  pinDraggedNode,
  pinGraphNodes,
  type GraphNodeWithCoords,
} from '../lib/focusNode'

type GraphNodeObject = GraphNodeWithCoords & NodeObject

type PortfolioGraph2DProps = {
  /**
   * @alias 그래프 데이터
   * @description 스냅샷에서 파생된 nodes/links.
   */
  data: GraphData
  selectedId: string | null
  onSelect: (id: string | null) => void
  width: number
  height: number
  focusRequest: FocusRequest | null
  clearOnBackground?: boolean
  onReady?: () => void
}

/**
 * @alias 2D 포스 그래프
 * @description WebGL 불가 시 캔버스 폴백 그래프.
 */
export function PortfolioGraph2D({
  data,
  selectedId,
  onSelect,
  width,
  height,
  focusRequest,
  clearOnBackground = true,
  onReady,
}: PortfolioGraph2DProps) {
  const graphRef = useRef<ForceGraphMethods<GraphNodeObject> | undefined>(
    undefined,
  )
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

  const settleAndReady = useCallback(() => {
    if (!pinnedRef.current) {
      pinGraphNodes(graphData.nodes)
      pinnedRef.current = true
      setPinned(true)
    }
    if (!readySentRef.current) {
      readySentRef.current = true
      window.requestAnimationFrame(() => onReady?.())
    }
  }, [graphData.nodes, onReady])

  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return

    const charge = graph.d3Force('charge') as
      | { strength?: (value: number) => void }
      | undefined
    charge?.strength?.(-280)

    const link = graph.d3Force('link') as
      | { distance?: (value: number) => void }
      | undefined
    link?.distance?.(100)

    const settleTimer = window.setTimeout(settleAndReady, 1600)
    return () => window.clearTimeout(settleTimer)
  }, [settleAndReady])

  useEffect(() => {
    if (!focusRequest || !pinned) return
    if (lastFocusNonce.current === focusRequest.nonce) return

    lastFocusNonce.current = focusRequest.nonce

    const graph = graphRef.current
    const node = findNodeById(graphData.nodes, focusRequest.nodeId)
    if (graph && node) {
      focusNode2D(graph, node, 900)
    }
  }, [focusRequest, pinned, graphData.nodes])

  return (
    <ForceGraph2D
      ref={graphRef}
      graphData={graphData}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      enableNodeDrag
      warmupTicks={60}
      cooldownTicks={120}
      cooldownTime={2200}
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
      linkDirectionalParticles={2}
      linkDirectionalParticleWidth={1.3}
      linkDirectionalParticleSpeed={0.004}
      nodeCanvasObject={(node, ctx, globalScale) => {
        const item = node as GraphNodeObject
        const body = getCelestialBody(String(item.id))
        const radius = body.size * 1.15
        const color = body.color
        const x = node.x ?? 0
        const y = node.y ?? 0
        const selected = selectedId === item.id
        const isSun = body.role === 'sun'

        ctx.beginPath()
        ctx.arc(x, y, radius * (isSun ? 2.1 : 1.65), 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = isSun ? 0.2 : selected ? 0.22 : 0.12
        ctx.fill()
        ctx.globalAlpha = 1

        const planet = ctx.createRadialGradient(
          x - radius * 0.3,
          y - radius * 0.3,
          radius * 0.08,
          x,
          y,
          radius,
        )
        if (isSun) {
          planet.addColorStop(0, '#fff6c8')
          planet.addColorStop(0.35, '#ffd56a')
          planet.addColorStop(0.75, '#ff9a3c')
          planet.addColorStop(1, '#e86a1f')
        } else {
          planet.addColorStop(0, '#ffffff')
          planet.addColorStop(0.2, color)
          planet.addColorStop(1, '#0a1018')
        }
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = planet
        ctx.fill()

        if (body.hasRing) {
          ctx.beginPath()
          ctx.ellipse(
            x,
            y,
            radius * 1.9,
            radius * 0.5,
            body.ringTilt ?? -0.4,
            0,
            Math.PI * 2,
          )
          ctx.strokeStyle = body.role === 'saturn' ? '#f0d9a0' : color
          ctx.globalAlpha = 0.5
          ctx.lineWidth = 2 / globalScale
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        if (selected) {
          ctx.lineWidth = 2.4 / globalScale
          ctx.strokeStyle = theme.colors.ink
          ctx.beginPath()
          ctx.arc(x, y, radius + 2, 0, Math.PI * 2)
          ctx.stroke()
        }

        const label = item.label
        const fontSize = 12 / globalScale
        ctx.font = `600 ${fontSize}px IBM Plex Sans KR, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'top'
        ctx.fillStyle = theme.colors.ink
        ctx.fillText(label, x, y + radius + 4)
      }}
      nodePointerAreaPaint={(node, color, ctx) => {
        const item = node as GraphNodeObject
        const body = getCelestialBody(String(item.id))
        ctx.beginPath()
        ctx.arc(
          node.x ?? 0,
          node.y ?? 0,
          body.size * 1.15 + 4,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = color
        ctx.fill()
      }}
      onNodeClick={(node) => onSelect(String(node.id))}
      onBackgroundClick={() => {
        if (clearOnBackground) onSelect(null)
      }}
      onEngineStop={settleAndReady}
      onNodeDrag={(node) => {
        const current = node as GraphNodeWithCoords
        current.fx = undefined
        current.fy = undefined
      }}
      onNodeDragEnd={(node) => {
        pinDraggedNode(node as GraphNodeWithCoords)
      }}
    />
  )
}
