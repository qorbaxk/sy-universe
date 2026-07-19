import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type BadgeProps = {
  /**
   * @alias 자식
   * @description 배지 텍스트.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 배지
 * @description 기간·상태 등 짧은 메타 표시 atom.
 */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-xs text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
