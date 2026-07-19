import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

/**
 * @alias 아이브로우 variant
 * @description accent(골드) / soft(민트) / muted.
 */
export type EyebrowVariant = 'accent' | 'soft' | 'muted'

type EyebrowProps = {
  /**
   * @alias 스타일 variant
   * @description 기본값은 accent(골드).
   */
  variant?: EyebrowVariant

  /**
   * @alias 자식
   * @description 작은 상단 라벨 텍스트.
   */
  children: ReactNode
  className?: string
}

const variantClass: Record<EyebrowVariant, string> = {
  accent: 'text-accent',
  soft: 'text-accent-2',
  muted: 'text-muted',
}

/**
 * @alias 아이브로우
 * @description 섹션/패널 상단의 작은 카테고리 라벨.
 */
export function Eyebrow({
  variant = 'accent',
  children,
  className,
}: EyebrowProps) {
  return (
    <span
      className={cn(
        'text-[0.75rem] font-semibold tracking-[0.08em] uppercase',
        variantClass[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
