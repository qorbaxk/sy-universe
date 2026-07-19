import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type EyebrowProps = {
  /**
   * @alias 자식
   * @description 작은 상단 라벨 텍스트.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 아이브로우
 * @description 섹션/패널 상단의 작은 카테고리 라벨.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'text-[11px] font-semibold tracking-[0.14em] text-accent-2 uppercase',
        className,
      )}
    >
      {children}
    </span>
  )
}
