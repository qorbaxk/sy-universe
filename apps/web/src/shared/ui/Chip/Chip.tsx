import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

type ChipProps = {
  /**
   * @alias 자식
   * @description 칩 텍스트.
   */
  children: ReactNode
  className?: string
}

/**
 * @alias 칩
 * @description 스택·태그 한 칸을 표현하는 atom.
 */
export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-ink',
        className,
      )}
    >
      {children}
    </span>
  )
}
