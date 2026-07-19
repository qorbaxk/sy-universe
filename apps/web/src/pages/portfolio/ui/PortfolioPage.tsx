import { useEffect, useState } from 'react'
import { getNodeById, tourSteps, usePortfolioQuery } from '@/entities/portfolio'
import { GuideChatPanel } from '@/features/guide-chat'
import { GraphTourControls, TOUR_TOTAL, useTourStore } from '@/features/graph-tour'
import {
  useFocusStore,
  useSelectionStore,
} from '@/features/select-graph-node'
import { hideBootSplash } from '@/shared/lib/boot/hideBootSplash'
import { cn } from '@/shared/lib/cn'
import { SpaceBackdrop } from '@/shared/ui/SpaceBackdrop'
import { AppTopbar } from '@/widgets/app-topbar'
import { DetailPanel } from '@/widgets/detail-panel'
import { PortfolioGraph } from '@/widgets/portfolio-graph'

/**
 * @alias 포트폴리오 페이지
 * @description 쿼리·스토어·위젯을 조합하는 페이지 셸. 비즈니스 로직은 훅/스토어에 둔다.
 */
export function PortfolioPage() {
  const { data, isLoading, isError } = usePortfolioQuery()
  const selectedId = useSelectionStore((s) => s.selectedId)
  const selectNode = useSelectionStore((s) => s.selectNode)
  const clearSelection = useSelectionStore((s) => s.clearSelection)
  const focusRequest = useFocusStore((s) => s.focusRequest)
  const focusNode = useFocusStore((s) => s.focusNode)
  const [guideOpen, setGuideOpen] = useState(false)

  // primitive만 구독 — 객체 selector는 getSnapshot 무한루프를 만든다
  const tourActive = useTourStore((s) => s.active)
  const tourIndex = useTourStore((s) => s.index)
  const startTour = useTourStore((s) => s.start)
  const stopTour = useTourStore((s) => s.stop)
  const prevTour = useTourStore((s) => s.prev)
  const nextTour = useTourStore((s) => s.next)

  const tourStep = tourSteps[tourIndex] ?? tourSteps[0]
  const isFirst = tourIndex === 0
  const isLast = tourIndex === TOUR_TOTAL - 1

  useEffect(() => {
    if (isError) hideBootSplash()
  }, [isError])

  useEffect(() => {
    const timer = window.setTimeout(() => hideBootSplash(), 8000)
    return () => window.clearTimeout(timer)
  }, [])

  const visitNode = (nodeId: string) => {
    selectNode(nodeId)
    focusNode(nodeId)
  }

  const selectedNode = data
    ? getNodeById(data.graph.nodes, selectedId)
    : null
  const panelOpen = Boolean(selectedNode)

  if (isLoading) {
    return <div className="min-h-screen bg-[#02050c]" aria-busy="true" />
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#02050c] text-muted">
        포트폴리오 데이터를 불러오지 못했어요.
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative min-h-screen overflow-hidden text-ink',
        panelOpen && 'pr-0',
      )}
    >
      <h1 className="sr-only">승연 · Frontend Developer Portfolio</h1>
      <SpaceBackdrop />
      <AppTopbar
        profile={data.snapshot.profile}
        guideOpen={guideOpen}
        onToggleGuide={() => setGuideOpen((value) => !value)}
        onContactClick={() => {
          setGuideOpen(false)
          visitNode('contact')
        }}
      />

      <div className="fixed inset-0 z-[1] bg-transparent">
        <PortfolioGraph
          data={data.graph}
          selectedId={selectedId}
          onSelect={(id) => {
            if (!id) {
              if (tourActive) return
              clearSelection()
              return
            }
            visitNode(id)
          }}
          focusRequest={focusRequest}
          clearOnBackground={!tourActive}
          onReady={() => {
            visitNode('me')
            window.requestAnimationFrame(() => hideBootSplash())
          }}
        />
      </div>

      <DetailPanel
        snapshot={data.snapshot}
        node={selectedNode}
        onNavigateNode={visitNode}
        tourActive={tourActive}
        onClose={() => {
          if (tourActive) stopTour()
          clearSelection()
        }}
      />

      <GuideChatPanel
        open={guideOpen}
        onOpenChange={setGuideOpen}
        detailPanelOpen={panelOpen}
      />

      <GraphTourControls
        active={tourActive}
        step={tourStep}
        index={tourIndex}
        total={TOUR_TOTAL}
        isFirst={isFirst}
        isLast={isLast}
        onStart={() => startTour(visitNode)}
        onStop={stopTour}
        onPrev={() => prevTour(visitNode)}
        onNext={() => {
          if (isLast) {
            stopTour()
            return
          }
          nextTour(visitNode)
        }}
      />
    </div>
  )
}
