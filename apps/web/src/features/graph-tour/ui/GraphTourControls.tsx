import { Button } from '@/shared/ui/Button'
import type { TourStep } from '@/entities/portfolio'
import './GraphTourControls.css'

type GraphTourControlsProps = {
  active: boolean
  step: TourStep | null
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  onStart: () => void
  onStop: () => void
  onPrev: () => void
  onNext: () => void
}

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
      <div className="graph-tour graph-tour--idle">
        <div className="graph-tour__idle">
          <div className="graph-tour__idle-copy">
            <strong>포트폴리오 가이드</strong>
            <p>추천 순서대로 노드를 따라가 보세요</p>
          </div>
          <Button
            variant="accent"
            className="graph-tour__start"
            onClick={onStart}
          >
            가이드 시작
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="graph-tour graph-tour--active">
      <div className="graph-tour__progress">
        <span>
          {index + 1} / {total}
        </span>
        <div className="graph-tour__bar">
          <i style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="graph-tour__copy">
        <strong>{step?.title}</strong>
        <p>{step?.description}</p>
      </div>

      <div className="graph-tour__actions">
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
