import { useCallback, useState } from 'react'
import { graphNodes, getNodeById } from '@/entities/portfolio'
import { GraphTourControls, useGraphTour } from '@/features/graph-tour'
import { useSelectedNode } from '@/features/select-graph-node'
import { SpaceBackdrop } from '@/shared/ui/SpaceBackdrop'
import { cn } from '@/shared/lib/cn'
import { AppTopbar } from '@/widgets/app-topbar'
import { DetailPanel } from '@/widgets/detail-panel'
import { PortfolioGraph, type FocusRequest } from '@/widgets/portfolio-graph'
import './PortfolioPage.css'

export function PortfolioPage() {
  const { selectedId, selectNode, clearSelection } = useSelectedNode('me')
  const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null)

  const focusNode = useCallback((nodeId: string) => {
    selectNode(nodeId)
    setFocusRequest((prev) => ({
      nodeId,
      nonce: (prev?.nonce ?? 0) + 1,
    }))
  }, [selectNode])

  const tour = useGraphTour({
    onVisit: focusNode,
  })

  const selectedNode = getNodeById(graphNodes, selectedId)
  const panelOpen = Boolean(selectedNode)

  const handleReady = useCallback(() => {
    focusNode('me')
  }, [focusNode])

  const handleSelect = useCallback(
    (id: string | null) => {
      if (!id) {
        if (tour.active) return
        clearSelection()
        return
      }
      focusNode(id)
    },
    [clearSelection, focusNode, tour.active],
  )

  const handleClosePanel = useCallback(() => {
    if (tour.active) return
    clearSelection()
  }, [clearSelection, tour.active])

  return (
    <div className={cn('portfolio-page', panelOpen && 'is-panel-open')}>
      <h1 className="sr-only">승연 · Frontend Developer Portfolio</h1>
      <SpaceBackdrop />
      <AppTopbar />

      <div className="portfolio-stage">
        <PortfolioGraph
          selectedId={selectedId}
          onSelect={handleSelect}
          focusRequest={focusRequest}
          clearOnBackground={!tour.active}
          onReady={handleReady}
        />
      </div>

      <DetailPanel node={selectedNode} onClose={handleClosePanel} />
      <GraphTourControls
        active={tour.active}
        step={tour.step}
        index={tour.index}
        total={tour.total}
        isFirst={tour.isFirst}
        isLast={tour.isLast}
        onStart={tour.start}
        onStop={tour.stop}
        onPrev={tour.prev}
        onNext={tour.next}
      />
    </div>
  )
}
