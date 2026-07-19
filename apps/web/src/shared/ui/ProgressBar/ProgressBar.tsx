import { cn } from '@/shared/lib/cn'

/**
 * @alias 진행바 fill variant
 * @description gradient(골드→민트) / accent / accent-2.
 */
export type ProgressBarVariant = 'gradient' | 'accent' | 'accent-2'

type ProgressBarProps = {
  /**
   * @alias 진행률
   * @description 0–100 사이 퍼센트.
   */
  value: number

  /**
   * @alias fill 스타일
   * @description 기본값은 gradient.
   */
  variant?: ProgressBarVariant

  className?: string
  /**
   * @alias fill 클래스
   * @description 내부 바 커스텀 클래스.
   */
  barClassName?: string
}

const fillClass: Record<ProgressBarVariant, string> = {
  gradient: 'bg-gradient-to-r from-accent to-accent-2',
  accent: 'bg-accent',
  'accent-2': 'bg-accent-2',
}

/**
 * @alias 진행바
 * @description 투어·로딩 등 짧은 진행률 표시 atom.
 */
export function ProgressBar({
  value,
  variant = 'gradient',
  className,
  barClassName,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className={cn(
        'h-1 overflow-hidden rounded-full bg-white/10',
        className,
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
    >
      <i
        className={cn(
          'block h-full rounded-full transition-[width] duration-300 ease-out',
          fillClass[variant],
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
