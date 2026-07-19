import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * @alias 배지 variant
 * @description neutral(중립) / accent(골드) / soft(민트).
 */
export type BadgeVariant = 'neutral' | 'accent' | 'soft'

type BadgeProps = {
  /**
   * @alias 스타일 variant
   * @description 기본값은 accent(골드 톤).
   */
  variant?: BadgeVariant

  /**
   * @alias 자식
   * @description 배지 텍스트.
   */
  children: ReactNode
  className?: string
}

const variantClass: Record<BadgeVariant, string> = {
  neutral: 'border-white/10 bg-white/[0.06] text-ink',
  accent: 'border-accent/25 bg-accent/12 text-accent',
  soft: 'border-accent-2/25 bg-accent-2/12 text-accent-2',
}

/**
 * @alias 배지
 * @description 기간·상태 등 짧은 메타 표시 atom.
 */
export function Badge({
  variant = 'accent',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-1 text-[0.72rem] tracking-[0.08em] uppercase',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
