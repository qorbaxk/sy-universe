import type { TourStep } from '@/entities/portfolio'
import { Button } from '@/shared/ui/Button'

type GraphTourControlsProps = {
  /**
   * @alias 활성 여부
   * @description 투어 진행 중이면 true.
   */
  active: boolean

  /**
   * @alias 현재 스텝
   * @description 표시할 투어 카드 내용.
   */
  step: TourStep | null

  /**
   * @alias 현재 인덱스
   * @description 0-based 스텝 번호.
   */
  index: number

  /**
   * @alias 전체 개수
   * @description 투어 스텝 총 수.
   */
  total: number

  /**
   * @alias 첫 스텝 여부
   * @description 이전이 비활성일 때 true.
   */
  isFirst: boolean

  /**
   * @alias 마지막 스텝 여부
   * @description 다음 버튼이 '완료'로 바뀔 때 true.
   */
  isLast: boolean

  onStart: () => void
  onStop: () => void
  onPrev: () => void
  onNext: () => void
}

/**
 * @alias 가이드 투어 컨트롤
 * @description 왼쪽 하단 투어 UI. 상태/로직은 스토어에서 주입받는다.
 */
export function GraphTourControls({
  active,
  step,
  index,
  total,
  isFirst,
  isLast,
  onStart,
  onStop,
  onPrev,
  onNext,
}: GraphTourControlsProps) {
  if (!active) {
    return (
      <div className="fixed bottom-5 left-5 z-40 w-[min(320px,calc(100vw-2rem))] rounded-2xl border border-white/10 bg-[#0b1118]/88 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <strong className="block text-sm text-ink">포트폴리오 가이드</strong>
            <p className="mt-0.5 text-xs text-muted">
              추천 순서대로 노드를 따라가 보세요
            </p>
          </div>
          <Button variant="accent" onClick={onStart}>
            가이드 시작
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 w-[min(340px,calc(100vw-2rem))] space-y-3 rounded-2xl border border-white/10 bg-[#0b1118]/9 p-3.5 shadow-xl backdrop-blur-xl">
      <div className="space-y-1.5">
        <span className="text-xs text-muted">
          {index + 1} / {total}
        </span>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <i
            className="block h-full rounded-full bg-accent-2 transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <strong className="block text-sm text-ink">{step?.title}</strong>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          {step?.description}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onStop}>
          종료
        </Button>
        <Button variant="outline" onClick={onPrev} disabled={isFirst}>
          이전
        </Button>
        <Button variant="accent" onClick={onNext}>
          {isLast ? '완료' : '다음'}
        </Button>
      </div>
    </div>
  )
}
